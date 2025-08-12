# Notification Token Management

This feature handles Firebase Cloud Messaging (FCM) notification tokens for user notifications with support for multiple devices.

## Overview

The notification system automatically:
1. **For existing users**: Checks if token exists in `fcmTokens` array, adds if new, updates `notifToken`
2. **For new users**: Sets the FCM token during profile completion
3. **Multi-device support**: Maintains array of tokens for multiple devices per user
4. **Token refresh**: Automatically updates tokens when they change

## Token Management Logic

### Adding Tokens
- Check if token exists in `fcmTokens` array
- If **new token**: Add to array + update `notifToken` 
- If **existing token**: Only update `notifToken` (current active device)

### Token Structure
```typescript
{
  notifToken: string;        // Current active device token
  fcmTokens: string[];       // All device tokens for this user
}
```

## Files

### Core Services
- `src/features/notifications/useNotificationService.ts` - Main notification service hook
- `src/features/dashboard/profile/services.ts` - Profile-specific notification handling

### Components
- `src/features/dashboard/profile/ui/ProfileCompletion.tsx` - Sets token during profile creation
- `src/common/layouts/DashboardLayout.tsx` - Updates token for existing users

## Usage

### For Profile Completion (New Users)
```typescript
const { createUserData, initializeNotificationToken } = useProfileServices();

// Automatically called when component mounts
useEffect(() => {
    initializeNotificationToken();
}, [authUser?.uid]);
```

### For Existing Users (Dashboard)
```typescript
const { requestAndUpdateNotificationToken } = useNotificationService();

// Called when dashboard loads
useEffect(() => {
    requestAndUpdateNotificationToken();
}, []);
```

### Manual Token Management
```typescript
const { 
  getFCMToken, 
  updateUserNotificationToken,
  removeTokenFromUser 
} = useProfileServices();

// Get FCM token
const token = await getFCMToken();

// Add/Update user's token (smart array management)
await updateUserNotificationToken(userId, token);

// Remove specific token (e.g., user logged out from device)
await removeTokenFromUser(userId, tokenToRemove);
```

## Flow

1. **User Authentication**: User logs in via OAuth
2. **Token Check**: System checks if user data exists
3. **Token Handling**:
   - **Existing User**: 
     - Check if token exists in `fcmTokens` array
     - If new: Add to array + update `notifToken`
     - If exists: Update `notifToken` only
   - **New User**: Token will be set during profile completion
4. **Database Update**: Smart update of `notifToken` and `fcmTokens` fields

## Database Schema

```typescript
interface IUserData {
  notifToken: string;        // Current active device FCM token
  fcmTokens: string[];       // Array of all FCM tokens (multi-device)
  // ... other fields
}
```

## Multi-Device Support

- ✅ **Multiple Devices**: Each device gets added to `fcmTokens` array
- ✅ **Active Device**: `notifToken` tracks current active device
- ✅ **Token Cleanup**: `removeTokenFromUser()` for device logout/uninstall
- ✅ **Smart Updates**: Only updates database when necessary

## Error Handling

- Graceful handling when notification permission is denied
- Fallback when FCM token generation fails
- Console logging for debugging
- Safe array operations (no duplicates)

## Environment Variables

Requires `APP_VAPID_KEY` in environment configuration for FCM token generation.
