# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Setup**
```bash
yarn install     # Install dependencies (requires Node 20+)
```

**Development**
```bash
yarn dev         # Start development server (http://localhost:5173)
yarn build       # Build for production (outputs to dist/)
yarn lint        # Run ESLint
yarn preview     # Preview production build
```

**Node Version**
- Use Node.js version 20 (see .nvmrc)
- Run `nvm use 20` if using nvm

## Architecture Overview

This is a React 18 + TypeScript + Vite job marketplace application with the following key architectural patterns:

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Mantine v7 (components, forms, notifications, charts, dropzone, dates, carousel, tiptap)
- **Routing**: React Router v6 with custom auth guards
- **State Management**: Zustand + Custom Firebase Auth Context
- **Styling**: CSS Modules + Sass + Tailwind CSS
- **Authentication**: Firebase Auth (OAuth providers: Google, Apple, Facebook, X)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Maps**: Google Maps API + @react-google-maps/api
- **Search**: Algolia (react-instantsearch)
- **Rich Text**: TipTap editor
- **HTTP Client**: Axios with custom interceptors
- **AI Features**: Smart hire candidate matching

### Project Structure
```
src/
├── App.tsx              # Main app with providers (Mantine, Auth, Router)
├── routes/              # React Router configuration
│   └── Router.tsx       # Route definitions with auth guards
├── pages/               # Page-level components
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Protected dashboard pages
├── features/           # Feature-based organization
│   ├── auth/           # Authentication logic
│   ├── dashboard/      # Dashboard features (jobs, profile, settings, notifications)
│   ├── services/       # Shared API services
│   └── hooks/          # Shared hooks
├── common/             # Shared components and utilities
│   ├── layouts/        # Layout components (Dashboard, Auth, Public)
│   ├── theme.ts        # Mantine theme configuration
│   └── icons.tsx       # Icon components
└── config/             # Configuration files
    ├── env.ts          # Environment variables
    └── firebase.ts     # Firebase configuration
```

### Feature-Based Architecture
Each feature follows this structure:
```
features/<feature-name>/
├── components/         # Feature-specific components
├── ui/                # UI components
├── hooks.ts           # Feature-specific hooks
├── services.ts        # API calls and business logic
├── stores.ts          # Zustand stores
├── types.ts           # TypeScript interfaces
└── data.ts            # Mock/static data
```

### Key Patterns

**Authentication Flow**
- Custom `FirebaseAuthContext` (src/features/auth/context/FirebaseAuthContext.tsx) manages auth state
- Firebase Auth handles OAuth providers (Google, Apple, Facebook, X)
- User data persisted in localStorage + Firestore `users` collection
- Protected routes use `RequireAuth` wrapper (src/features/auth/components/RequireAuth.tsx)
- Firebase ID tokens automatically injected into API calls via `useApiClient` hook

**Database Architecture (Firestore)**
- **users**: User profiles with FCM tokens for notifications
- **jobPosts**: Job listings with nested `applications` subcollection per job
- **savedJobs**: User's saved jobs (denormalized with full job details)
- **hiredJobs**: Jobs with hired applicants, nested `applicants` subcollection
- **categories**, **commitmentTypes**, **workLocations**, **urgencyLevels**: Static reference data

**API Communication**
- `useApiClient` hook (src/features/services/ApiClient.ts) with axios interceptors
- Auto-injects Firebase ID token as Bearer token in Authorization header
- CSRF protection via X-CSRF-Token and X-Requested-With headers for non-GET requests
- Base URLs: `VITE_BASE_URL` (backend API), `VITE_AI_BASE_URL` (AI services)
- Automatic error handling for 400/401/403/404 responses

**Notifications System**
- Firebase Cloud Messaging (FCM) for push notifications
- Multi-device support: `fcmTokens` array stores all device tokens per user
- `notifToken` field tracks current active device
- Auto-updates tokens on dashboard load for existing users
- See src/features/notifications/README.md for detailed flow

**State Management**
- Zustand for local feature state (jobs, notifications, settings)
- Custom FirebaseAuthContext for authentication state
- Mantine notifications for global toast notifications

**UI Patterns**
- Consistent Mantine theme with custom Button/TextInput/Select defaults
- CSS Modules for component-specific styles
- Tailwind for utility classes
- Responsive design patterns

## Environment Variables
Required environment variables (configure in `.env`, see `.env.example`):
- `VITE_BASE_URL` - Backend API base URL
- `VITE_AI_BASE_URL` - AI services base URL (smart hire features)
- `VITE_FIREBASE_API` - Firebase API key
- `VITE_APP_VAPID_KEY` - Firebase Cloud Messaging VAPID key (for push notifications)
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (for job location features)
- `VITE_ALGOLIA_APP_ID` - Algolia application ID (for job search)
- `VITE_ALGOLIA_SEARCH_KEY` - Algolia search-only API key
- `VITE_ALGOLIA_INDEX_NAME` - Algolia index name for jobs
- `VITE_NODE_ENV` - Environment mode (`production` or `development`)
  - Controls `isProduction` flag used in Firestore queries

## Important Notes

**Authentication**
- Custom `FirebaseAuthContext` manages authentication state (not react-auth-kit)
- Access auth via `useAuth()` hook from FirebaseAuthContext
- User data stored in both localStorage and Firestore for persistence
- Firebase ID tokens auto-refresh and inject into API headers
- Methods: `signIn()`, `signOutUser()`, `getIdToken()`, `updateUser()`

**Routing**
- Public routes: `/` (landing page), `/jobs` (job listings), `/jobs/:id` (job details)
- Auth routes: `/signin`, `/signup`
- Protected routes (require authentication):
  - `/my_jobs` - View applied and posted jobs
  - `/my_jobs/:id/applied` - Applied job details
  - `/my_jobs/:id/posted` - Posted job details with applicants
  - `/post_job` - Create new job posting
  - `/profile` - User profile
  - `/complete_profile` - Profile completion flow for new users
  - `/delete/account/request` - Account deletion

**Data Fetching Patterns**
- Most data comes from Firestore (via `useJobServices`, `useProfileServices`)
- Pagination uses Firestore cursor-based pagination with `startAfter`/`endBefore`
- Job applications are nested subcollections under each job document
- Smart hire features call external AI API (`VITE_AI_BASE_URL`)

**Environment Flag Usage**
- `Env.isProduction` flag filters all Firestore queries
- Allows development and production data to coexist in same Firestore instance
- Always include `where("isProduction", "==", Env.isProduction)` in queries

**Development**
- Uses feature-based folder structure for better organization
- Each feature is self-contained with its own components, services, and stores
- API client handles error responses and authentication automatically
- Mantine provides the component library with custom theme configuration