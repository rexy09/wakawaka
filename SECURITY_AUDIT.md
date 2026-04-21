# Security Audit Report -- Wakawaka

**Date:** 2026-04-16 (updated 2026-04-16)
**Scope:** Full client-side security review of the React 18 + TypeScript + Firebase job marketplace application.
**Covers:** Authentication, authorization, data handling, injection risks, configuration, and third-party integrations.
**Note:** Firestore rules are unified across the web dashboard and the Flutter mobile app (`/Users/zeke/Projects/apps/waka`) which share the same Firebase project.

---

## Table of Contents

- [Completed Fixes](#completed-fixes)
- [Remaining Vulnerabilities](#remaining-vulnerabilities)
  - [High Severity](#high-severity)
  - [Medium Severity](#medium-severity)
  - [Low Severity](#low-severity)
- [Deployment Steps](#deployment-steps)

---

## Completed Fixes

### 1. Firestore Security Rules (was CRITICAL)

**Problem:** No `firestore.rules` file existed. Any authenticated user could potentially read/write any document in any collection -- all client-side authorization checks were bypassable.

**Fix:** Created `firestore.rules` with comprehensive per-collection access control, then **revised to unified rules** covering both the web dashboard and the Flutter mobile app (which share the same Firestore database).

Initial version had 4 bugs found during cross-app audit:
- `savedJobs` rules checked `savedByUserId` but both apps write `userId` -- **fixed**
- `users` was owner-read-only but both apps read other users' profiles -- **relaxed to authenticated read**
- `bids` checked `resource.data.uid` but mobile writes `bidderId` -- **fixed**
- `hiredJobs` blocked hired workers from seeing their own records -- **fixed**

Unified rules now cover all collections from both apps:
- **Users:** authenticated read, owner write (both apps display other users' avatars/names)
- **Job posts + applications + bids + comments:** scoped to applicant/bidder and job poster
- **SmartHire results:** job poster only, backend write only
- **Saved jobs:** scoped by `userId` field (corrected from `savedByUserId`)
- **Hired jobs:** authenticated read (parent is metadata only), applicants subcollection scoped to poster + worker
- **Notifications:** owner read/update/delete, authenticated create (cross-user triggers)
- **Portfolio:** public read, owner write
- **Reports (job + user):** reporter can create and read own, admin manages via backend
- **Trusted contacts:** owner only (private safety contacts)
- **User verification:** owner read/create, admin approves via backend
- **User feedback:** owner create/read, admin manages via backend
- **User bans:** owner read, admin creates via backend
- **Reference data:** authenticated read, no client write
- **Account deletion requests:** create only
- **Default deny-all** for unmatched paths

**File:** `firestore.rules`
**Status:** Created but must be deployed (see [Deployment Steps](#deployment-steps))

**Privacy note:** Opening `users` to authenticated read means any logged-in user can read another user's full document including `phoneNumber` and `email`. Both apps already display this data in various contexts. To restrict this in the future, move sensitive fields to a `users/{userId}/private/contactInfo` subcollection with owner-only rules.

---

### 2. SmartHire AI Endpoints -- Auth + Ownership (was CRITICAL)

**Problem:** `smartHireTrigger()` and `smartHireStatus()` called the AI service using raw `axios` with no Firebase ID token. Any user who knew a job ID could trigger expensive AI processing and read results for jobs they didn't own. `getSmartHireResults()` read a dynamic Firestore subcollection with no ownership verification.

**Fix:** Added to `src/features/dashboard/jobs/services.ts`:
- `getAuthHeaders()` helper that injects the Firebase ID token as a Bearer token
- `verifyJobOwnership()` helper that checks the job exists and the current user is the poster
- All three SmartHire functions now call both helpers before proceeding

**File:** `src/features/dashboard/jobs/services.ts` (lines ~935-980)

---

### 3. Broken Access Control on Job Applications (was CRITICAL)

**Problem:** `getJobApplications()` fetched all applications for any job ID without verifying the caller was the job poster. This exposed applicant names, emails, cover letters, and resumes to any authenticated user.

**Fix:** Added ownership check at the top of `getJobApplications()` -- fetches the job first and throws `"Unauthorized: you do not own this job"` if `job.postedByUserId !== authUser.uid`.

**File:** `src/features/dashboard/jobs/services.ts` (lines ~722-746)

---

### 4. Sensitive User Data in localStorage (was CRITICAL)

**Problem:** Full user profile (id, uid, email, fullName, country, currency, role, verification status) was stored as plaintext JSON in `localStorage`. This data persists indefinitely and is readable by any XSS payload, browser extension, or anyone with physical device access. Data was also parsed back without any schema validation.

**Fix:**
- Replaced all `localStorage` usage with `sessionStorage` (data cleared when browser tab closes)
- Added `isValidAuthUser()` schema validation function that checks required fields and types before trusting deserialized data
- Updated `SignOutModal.tsx` to call `sessionStorage.clear()` instead of `localStorage.clear()`

**Files:**
- `src/features/auth/context/FirebaseAuthContext.tsx`
- `src/common/navs/dashboard/header/components/SignOutModal.tsx`

---

### 5. Client-Side CSRF Token Removed (was CRITICAL)

**Problem:** CSRF tokens were generated client-side via `crypto.randomUUID()` and sent in headers. A client-generated token provides zero actual CSRF protection because an attacker's site can generate its own valid token.

**Fix:** Removed the fake CSRF token generation entirely. The `X-Requested-With: XMLHttpRequest` header is retained as a lightweight CSRF mitigation (rejected by servers that check for it on cross-origin requests). Real CSRF protection should be implemented server-side (see Remaining item M1).

**File:** `src/features/services/ApiClient.ts`

---

### 6. XSS via dangerouslySetInnerHTML Removed (was HIGH)

**Problem:** Two files contained `dangerouslySetInnerHTML={{ __html: job.description }}` which renders user-supplied HTML without sanitization. Although commented out, the pattern was dangerous and could be accidentally re-enabled.

**Fix:** Removed the commented-out `dangerouslySetInnerHTML` blocks entirely. The safe `<Text>{job.description}</Text>` rendering was already in place as the active code.

**Files:**
- `src/features/dashboard/jobs/ui/AppliedJobDetails.tsx` (was line 232-236)
- `src/features/dashboard/jobs/ui/PostedJobDetails.tsx` (was line 531-535)

---

### 7. 401 Response Handler Implemented (was HIGH)

**Problem:** The axios response interceptor caught 400/401/403/404 errors but all handlers were commented out. Expired or revoked tokens produced 401 responses that were silently ignored -- the user continued using the app in an unauthenticated state.

**Fix:** Implemented a working 401 handler that:
1. Calls `signOutUser()` to clear auth state
2. Redirects to `/signin`

**File:** `src/features/services/ApiClient.ts`

---

### 8. Dead/Commented-Out Code Removed (was MEDIUM)

**Problem:** ~200 lines of commented-out code across multiple files increased attack surface and confused developers. Included old email/password auth flows, unused interceptors, and disabled error handlers.

**Fix:** Removed all dead code from:
- `src/features/services/ApiClient.ts` -- removed ~100 lines of commented-out interceptor code
- `src/features/auth/ui/LoginForm.tsx` -- removed ~80 lines (old email/password login, unused form state, unused imports)
- `src/features/auth/ui/SignupForm.tsx` -- removed ~60 lines (old signup flow, unused form state, unused imports)

---

## Remaining Vulnerabilities

### High Severity

#### H1. Weak Input Validation on Auth Forms

**Current state:** Login and signup forms use minimal validation (`isEmail()`, `isNotEmpty()`). No password complexity enforcement. Phone number validation only checks minimum length (9 chars), no maximum or format validation.

**Existing utilities not wired up:**
- `validatePassword()` in `src/common/utils/security.ts` -- enforces min length, uppercase, lowercase, numbers, special chars
- `validatePhoneNumber()` in `src/common/utils/security.ts` -- validates phone format

**Files to fix:**
- `src/features/auth/ui/LoginForm.tsx` -- add password validation (if email/password login is re-enabled)
- `src/features/auth/ui/SignupForm.tsx` -- add password validation (if email/password signup is re-enabled)
- `src/features/auth/ui/LoginWithPhoneForm.tsx` (lines 32-37) -- wire up `validatePhoneNumber()`

**Note:** Currently the app only uses OAuth (Google/Apple) sign-in buttons, so email/password validation is not actively reachable. However, `LoginWithPhoneForm.tsx` is active and should use proper validation.

**Suggested fix:**
```typescript
import { validatePhoneNumber } from '../../../common/utils/security';

// In form validation:
phone: (value) => validatePhoneNumber(value) ? null : "Enter a valid phone number",
```

---

#### H2. File Upload -- Client-Side Only Validation

**Current state:** Profile image uploads use `accept="image/png,image/jpeg"` which is trivially bypassed by modifying the request. No server-side or content-based (magic byte) validation visible in the codebase. Files are uploaded directly to Firebase Storage.

**Files affected:**
- `src/features/dashboard/settings/components/ProfileForm.tsx` (line 148)
- `src/features/dashboard/profile/ui/ProfileCompletion.tsx` (line 288)
- `src/features/dashboard/jobs/ui/PostJobForm.tsx` (lines 445-456, 551-562)

**Suggested fix:**
1. Add client-side magic byte validation before upload:
```typescript
async function validateImageFile(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  // PNG: 89 50 4E 47, JPEG: FF D8 FF
  const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50;
  const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8;
  return isPNG || isJPEG;
}
```
2. Add Firebase Storage security rules to restrict file types and sizes
3. Validate on the backend/Cloud Function before accepting

---

#### H3. Excessive Console Logging in Production

**Current state:** 120 `console.log/error/warn` calls across 33 files. Logs include error objects, Firestore document IDs, user data, and internal state. All visible in browser DevTools in production.

**Worst offenders:**
| File | Count |
|---|---|
| `src/features/dashboard/jobs/components/JobCard.tsx` | 9 |
| `src/features/dashboard/jobs/components/AppliedJobCard.tsx` | 9 |
| `src/features/notifications/useNotificationService.ts` | 10 |
| `src/features/dashboard/jobs/ui/PostedJobDetails.tsx` | 7 |
| `src/features/dashboard/jobs/ui/JobDetails.tsx` | 5 |

**Suggested fix:** Either remove console statements entirely, or gate them:
```typescript
const logger = {
  error: (...args: unknown[]) => {
    if (!Env.isProduction) console.error(...args);
  },
};
```

---

### Medium Severity

#### M1. Server-Side CSRF Protection Needed

**Current state:** The fake client-side CSRF token was removed. `X-Requested-With: XMLHttpRequest` is sent but true CSRF protection requires server-side implementation.

**Suggested fix:** Implement Double Submit Cookie pattern on the backend, or rely on `SameSite=Strict` cookies for session tokens. This is a backend task.

---

#### M2. Hardcoded Firebase Config Values

**Current state:** In `src/config/firebase.ts` (lines 10-15), `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, and `measurementId` are hardcoded. Only `apiKey` uses an environment variable.

**Suggested fix:** Move all values to `.env`:
```env
VITE_FIREBASE_AUTH_DOMAIN=daywaka-768aa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=daywaka-768aa
VITE_FIREBASE_STORAGE_BUCKET=daywaka-768aa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=476064351728
VITE_FIREBASE_APP_ID=1:476064351728:web:cbf66db67d2ee925380935
VITE_FIREBASE_MEASUREMENT_ID=G-HWQR5JX8KC
```

Update `src/config/env.ts` and `src/config/firebase.ts` to read from `import.meta.env`.

---

#### M3. `isProduction` Flag is Client-Side Only

**Current state:** All Firestore queries filter by `where("isProduction", "==", Env.isProduction)` but this is a client-side check. A user modifying client code can remove the filter and access dev/test data. Algolia search filter at `src/features/dashboard/jobs/components/SearchModal.tsx` is similarly bypassable.

**Suggested fix:** Add `isProduction` enforcement to Firestore security rules. For example, add to each read rule:
```
&& resource.data.isProduction == true  // for production deployment
```
For Algolia, use secured API keys generated server-side with embedded filters.

---

#### M4. Open Redirect in OAuth Registration

**Current state:** `src/features/auth/ui/LoginWithPhoneForm.tsx` (lines 91-98) constructs `redirect_uri` using `window.location.origin`. While `window.location.origin` is safe in most cases, the redirect URI should be hardcoded to prevent any subdomain or proxy-based attacks.

**Suggested fix:**
```typescript
const registrationUrl =
  `https://accounts.skyconnect.co.tz/realms/flex/protocol/openid-connect/registrations` +
  `?client_id=flex-sample-app` +
  `&response_type=code` +
  `&scope=openid profile email phone offline_access` +
  `&redirect_uri=https://yourdomain.com/login`;
```

---

#### M5. No Content-Security-Policy Headers

**Current state:** No CSP meta tag in `index.html` and no server-side header configuration. This increases the impact of any XSS vulnerability.

**Suggested fix:** Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.algolia.net;
    font-src 'self' https:;">
```
Tune the policy to match your actual external dependencies (Firebase, Algolia, Google Maps, etc.).

---

#### M6. Memory Leaks from `URL.createObjectURL()`

**Current state:** Four files create object URLs for image previews without calling `URL.revokeObjectURL()` on cleanup. This leaks memory on repeated file selections.

**Files affected:**
- `src/features/dashboard/jobs/components/JobCard.tsx` (line 250)
- `src/features/dashboard/settings/components/ProfileForm.tsx` (line 134)
- `src/features/dashboard/profile/ui/ProfileCompletion.tsx` (line 297)
- `src/features/dashboard/jobs/ui/PostJobForm.tsx` (line 544)

**Suggested fix:** Store the URL in state and revoke on cleanup:
```typescript
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

useEffect(() => {
  return () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };
}, [previewUrl]);

// When setting:
const url = URL.createObjectURL(file);
setPreviewUrl(url);
```

---

### Low Severity

#### L1. Firebase Auth Persistence Set to LOCAL

**Current state:** `src/config/firebase.ts` (line 25) uses `browserLocalPersistence`, keeping auth state across browser restarts. Risk on shared devices.

**Suggested fix:** Default to `browserSessionPersistence`. Optionally add a "Remember me" toggle on login that switches to `browserLocalPersistence`.

---

#### L2. No Rate Limiting

**Current state:** No client-side rate limiting on API calls, job postings, or SmartHire triggers. A `createRateLimiter()` utility exists in `src/common/utils/security.ts` but is unused.

**Suggested fix:** Apply the existing rate limiter to sensitive operations (SmartHire trigger, job posting, auth retries). Server-side rate limiting is more important and should be implemented on the backend.

---

#### L3. No Audit Logging for Auth Events

**Current state:** Login attempts, sign-outs, password changes, and OAuth connections are not logged to any server-side audit trail.

**Suggested fix:** Implement server-side audit logging for security-relevant events (timestamp, user ID, event type, IP, user agent, outcome). Can use Firebase Cloud Functions triggered by auth events.

---

#### L4. Google Maps API Key Without Restrictions

**Current state:** `src/features/dashboard/jobs/ui/PostJobForm.tsx` (line 213) loads the API key client-side. Without restrictions in Google Cloud Console, the key can be used by anyone.

**Suggested fix:** In Google Cloud Console > Credentials > API key settings:
- Set **Application restrictions** to "HTTP referrers" and add your production domain
- Set **API restrictions** to only "Maps JavaScript API" and "Places API"

---

## Deployment Steps

### Firestore Rules
The new `firestore.rules` file must be deployed to Firebase for the rules to take effect:
```bash
firebase deploy --only firestore:rules
```

**Before deploying to production**, test the rules using the Firebase Emulator:
```bash
firebase emulators:start --only firestore
```
Verify that:
- Users cannot read other users' profiles
- Job applications are only accessible to the applicant and job poster
- SmartHire results are restricted to the job poster
- Saved/hired jobs are scoped to the owning user

### User Session Migration
The switch from `localStorage` to `sessionStorage` means **all existing users will be signed out** on their next visit (their `user_data` key is now read from `sessionStorage`, which will be empty). This is expected and harmless -- Firebase Auth will still have their session, and they will be re-authenticated on next interaction that triggers the auth flow.
