# 🔐 Authentication Persistence Fix - Complete Guide

## 📋 Table of Contents

1. [Problem Analysis](#problem-analysis)
2. [Root Causes](#root-causes)
3. [Solution Implementation](#solution-implementation)
4. [How It Works Now](#how-it-works-now)
5. [Testing the Fix](#testing-the-fix)
6. [Best Practices](#best-practices)
7. [Optional Enhancements](#optional-enhancements)

---

## 🔍 Problem Analysis

### What Was Happening

When you refreshed the page while logged in:

1. ✅ Your **HTTP-only cookie** with the authentication token **persisted** (stored in browser)
2. ❌ Your **React Query cache** was **cleared** (memory-only)
3. ❌ Your **AuthGuard** checked for user data **immediately**
4. ❌ Since cache was empty, it redirected to login **before** the API call completed
5. ❌ User appeared logged out despite having a valid token

### The Problematic Flow

```
┌─────────────────┐
│  Page Refresh   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ React Query Cache Cleared   │
│ (All state lost)            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ AuthGuard Renders           │
│ useCurrentUser() called     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Returns:                    │
│ - data: undefined ❌        │
│ - isLoading: true ⏳        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Old AuthGuard Logic:        │
│ if (!user) redirect ❌      │
│ (Ignores isLoading!)        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Redirect to /login          │
│ (Too Early!)                │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ API call completes...       │
│ (But user already gone)     │
└─────────────────────────────┘
```

---

## 🎯 Root Causes

### 1. **Missing Loading State Check**

**Before (Broken):**

```typescript
export const AuthGuard = ({ children }: AuthGuardProps): JSX.Element => {
  const { data: user } = useCurrentUser(); // ❌ Only checking data

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};
```

**Problem:** The guard doesn't wait for the loading state to complete. It makes an immediate decision based on empty cache.

### 2. **Race Condition in App Initialization**

**Before (Broken):**

```typescript
authService.checkAuth().catch(() => {
  // Auth check failed
});
// ❌ Non-blocking - guards render before this completes
```

**Problem:** `authService.checkAuth()` runs asynchronously but nothing waits for it. AuthGuard renders and makes decisions before the prefetch completes.

### 3. **GuestGuard Using Wrong State Source**

**Before (Broken):**

```typescript
export const GuestGuard = ({ children }: GuestGuardProps): JSX.Element => {
  const { isAuthenticated } = useAppSelector((state) => state.auth); // ❌ Redux state
  // This is never updated properly!
};
```

**Problem:** GuestGuard was using a Redux flag that wasn't being synchronized with the actual auth state from React Query.

---

## ✅ Solution Implementation

### Changes Made

#### 1. **Fixed AuthGuard.tsx** ✓

```typescript
export const AuthGuard = ({ children }: AuthGuardProps): JSX.Element => {
  const { data: user, isLoading, isError } = useCurrentUser(); // ✅ All states
  const location = useLocation();

  // ✅ WAIT for auth check to complete
  if (isLoading) {
    return <SuspenseFallback message="Checking authentication..." />;
  }

  // ✅ Only redirect after we know for sure
  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // ✅ User is authenticated
  return <>{children}</>;
};
```

**Key improvements:**

- ✅ Checks `isLoading` state
- ✅ Shows loading UI while checking auth
- ✅ Only redirects after auth check completes
- ✅ Preserves `location.state` for return-to-page after login

#### 2. **Fixed GuestGuard.tsx** ✓

```typescript
export const GuestGuard = ({ children }: GuestGuardProps): JSX.Element => {
  const { data: user, isLoading } = useCurrentUser(); // ✅ Use same source

  if (isLoading) {
    return <SuspenseFallback message="Loading..." />;
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
```

**Key improvements:**

- ✅ Uses React Query (single source of truth)
- ✅ Waits for loading state
- ✅ Consistent with AuthGuard

#### 3. **Enhanced useCurrentUser Hook** ✓

```typescript
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
      return response.data;
    },
    retry: false, // ✅ Fail fast on 401
    staleTime: 1000 * 60 * 5, // ✅ 5 min fresh
    gcTime: 1000 * 60 * 10, // ✅ 10 min cache
    refetchOnWindowFocus: true, // ✅ Revalidate on focus
    refetchOnMount: true, // ✅ Check on mount
    refetchOnReconnect: true, // ✅ Check on reconnect
  });
};
```

**Key improvements:**

- ✅ Proper cache configuration
- ✅ Revalidation on important events
- ✅ Fail fast strategy (no retries on 401)

#### 4. **Improved App Initialization** ✓

```typescript
const initializeApp = async (): Promise<void> => {
  // Initialize theme
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  const theme: ThemeMode = /* ... */;

  dispatch(setTheme(theme));
  document.documentElement.classList.toggle('dark', theme === 'dark');

  // ✅ Prefetch auth state
  try {
    await authService.checkAuth();
    console.log('Auth state initialized successfully');
  } catch (error) {
    console.log('No active session found - user will be prompted to login');
  }
};
```

**Key improvements:**

- ✅ Better error handling
- ✅ Informative logging
- ✅ Proper async/await

---

## 🔄 How It Works Now

### The Fixed Flow

```
┌─────────────────┐
│  Page Refresh   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ App Initializes             │
│ authService.checkAuth()     │
│ prefetches user profile     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ React Query Cache           │
│ Populated with user data ✓  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ AuthGuard Renders           │
│ useCurrentUser() called     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ isLoading: true             │
│ Show loading screen ⏳      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Auth Check Complete         │
│ - Token valid? ✓            │
│ - User data fetched ✓       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ isLoading: false            │
│ data: { user object } ✓     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ AuthGuard Decision:         │
│ user exists → Show content  │
│ no user → Redirect login    │
└─────────────────────────────┘
```

### State Flow Diagram

```
Page Load
    │
    ├─→ [Cookie exists?]
    │       │
    │       ├─→ YES → API call /auth/profile
    │       │              │
    │       │              ├─→ 200 OK → User data → isLoading: false, data: user ✓
    │       │              │
    │       │              └─→ 401 Unauthorized → isLoading: false, error: true → Redirect /login
    │       │
    │       └─→ NO → API call /auth/profile
    │                      │
    │                      └─→ 401 → isLoading: false, error: true → Redirect /login
    │
    └─→ [Guards Check]
            │
            ├─→ isLoading: true → Show <SuspenseFallback />
            │
            └─→ isLoading: false
                    │
                    ├─→ user exists → Render protected content
                    │
                    └─→ no user → Redirect to /login
```

---

## 🧪 Testing the Fix

### Test Scenarios

#### ✅ Scenario 1: Logged In User Refreshes Page

1. Login to the app
2. Navigate to `/dashboard` or any protected route
3. Press F5 or Cmd+R to refresh
4. **Expected:** You should see:
   - Brief loading screen ("Checking authentication...")
   - Then the dashboard page loads without redirect
5. **Check console:** Should see "Auth state initialized successfully"

#### ✅ Scenario 2: User Not Logged In Tries to Access Protected Route

1. Logout completely (or open in incognito)
2. Try to navigate to `/dashboard/users`
3. **Expected:** You should see:
   - Brief loading screen
   - Redirect to `/login`
   - After login, redirect back to `/dashboard/users`

#### ✅ Scenario 3: Token Expires During Session

1. Login normally
2. Wait for token to expire (or manually delete the cookie)
3. Try to navigate or refresh
4. **Expected:**
   - Your `axiosInstance.ts` interceptor will try to refresh
   - If refresh fails, redirect to login
   - User can login again seamlessly

#### ✅ Scenario 4: Logged In User Tries to Access Login Page

1. Login to the app
2. Try to navigate to `/login` manually
3. **Expected:**
   - GuestGuard detects you're logged in
   - Redirect to `/dashboard`

#### ✅ Scenario 5: Slow Network Connection

1. Open Chrome DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh the page
4. **Expected:**
   - Loading screen shows while auth check runs
   - Eventually resolves correctly
   - No premature redirects

---

## 📚 Best Practices Implemented

### 1. **Single Source of Truth**

- React Query is the **only** source for user auth state
- Redux `authSlice` is no longer needed for user data (you can remove it or keep for UI-only flags)
- All guards use the same `useCurrentUser()` hook

### 2. **Proper Loading States**

- Every guard checks `isLoading` before making decisions
- Users see appropriate loading UI instead of flickering
- No race conditions or premature redirects

### 3. **HTTP-Only Cookies (Already Implemented)**

- Your tokens are stored in HTTP-only cookies ✓
- `withCredentials: true` sends cookies with requests ✓
- Tokens are safe from XSS attacks ✓

### 4. **Token Refresh Strategy (Already Implemented)**

- Your `axiosInstance.ts` handles 401 responses ✓
- Automatically tries to refresh tokens ✓
- Queues failed requests and retries after refresh ✓

### 5. **Cache Management**

```typescript
staleTime: 1000 * 60 * 5,      // Data fresh for 5 minutes
gcTime: 1000 * 60 * 10,         // Cache kept for 10 minutes
refetchOnWindowFocus: true,     // Recheck when tab focused
refetchOnMount: true,           // Always check on mount
refetchOnReconnect: true,       // Check when online again
```

### 6. **Graceful Error Handling**

- Failed auth checks don't crash the app
- Users are redirected appropriately
- Original route is preserved for post-login redirect

---

## 🚀 Optional Enhancements

### Enhancement 1: Optimistic UI Updates

When logging in, set the query cache immediately:

```typescript
// In useLogin mutation
onSuccess: (user) => {
  queryClient.setQueryData(authKeys.profile(), user);
  showToast.success('Login successful');
  navigate('/');
},
```

✅ **Already implemented in your code!**

### Enhancement 2: Persistent Cache (Optional)

If you want to cache user data across page refreshes without API calls:

```bash
npm install @tanstack/react-query-persist-client
npm install idb-keyval
```

```typescript
// In lib/react-query.tsx
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const ReactQueryProvider = ({ children }: Props): JSX.Element => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Only persist auth queries
            return query.queryKey[0] === 'auth';
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
```

⚠️ **Caution:** This stores user data in localStorage. Make sure it doesn't include sensitive info.

### Enhancement 3: Auth Context Provider (Optional)

Create a centralized auth context for better organization:

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { useCurrentUser } from '../hooks/queries';
import type { UserProfileDto } from '../dto';

interface AuthContextValue {
  user: UserProfileDto | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useCurrentUser();

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    isError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

Then wrap your app:

```typescript
// App.tsx
<ReactQueryProvider>
  <AuthProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </AuthProvider>
</ReactQueryProvider>
```

### Enhancement 4: Session Timeout Warning

Show a warning before the session expires:

```typescript
// hooks/useSessionTimeout.ts
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 min before

export const useSessionTimeout = () => {
  const { isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const warningTimer = setTimeout(() => {
      setShowWarning(true);
    }, SESSION_TIMEOUT - WARNING_TIME);

    const logoutTimer = setTimeout(() => {
      // Auto logout
      window.location.href = '/login?reason=timeout';
    }, SESSION_TIMEOUT);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [isAuthenticated]);

  return { showWarning };
};
```

---

## 🎓 Key Takeaways

### Why Your Auth Was Clearing

1. **React Query cache is memory-only** - it doesn't survive page refreshes
2. **Guards were checking empty cache** - before the API call completed
3. **No loading state handling** - guards made decisions too early

### Why the Fix Works

1. **Guards now wait** - they check `isLoading` before deciding
2. **Proper initialization** - `authService.checkAuth()` prefetches data
3. **Single source of truth** - React Query manages all auth state
4. **Your cookies persist** - tokens survive refresh (they always did!)

### The Architecture

```
┌───────────────────────────────────────────┐
│           HTTP-Only Cookie                │
│    (Persists across page refresh)         │
│    Contains: JWT access/refresh tokens    │
└───────────────┬───────────────────────────┘
                │
                │ Sent automatically
                │ with every request
                ▼
┌───────────────────────────────────────────┐
│         React Query Cache                 │
│    (Memory-only, cleared on refresh)      │
│    Contains: User profile data            │
│                                           │
│    - isLoading: true/false                │
│    - data: user object or undefined       │
│    - isError: true/false                  │
└───────────────┬───────────────────────────┘
                │
                │ Guards check this
                │ and wait for loading
                ▼
┌───────────────────────────────────────────┐
│         AuthGuard / GuestGuard            │
│                                           │
│    if (isLoading) → Show loading          │
│    if (!user) → Redirect to login         │
│    if (user) → Show protected content     │
└───────────────────────────────────────────┘
```

---

## ✨ Summary

### What Changed

1. ✅ **AuthGuard** - Now waits for loading state
2. ✅ **GuestGuard** - Uses React Query, waits for loading
3. ✅ **useCurrentUser** - Enhanced cache configuration
4. ✅ **App initialization** - Better error handling

### What You Get

1. ✅ **No more false logouts** on page refresh
2. ✅ **Smooth loading states** instead of flickering
3. ✅ **Proper auth rehydration** from cookies
4. ✅ **Production-ready architecture** with best practices

### Testing Checklist

- [ ] Refresh page while logged in → Should stay logged in
- [ ] Access protected route while logged out → Redirect to login
- [ ] Login → Should redirect to protected content
- [ ] Navigate to /login while logged in → Redirect to dashboard
- [ ] Token expires → Should handle gracefully with refresh

---

## 📞 Need Help?

If you encounter any issues:

1. **Check browser console** - Look for auth-related logs
2. **Check Network tab** - See if `/auth/profile` is being called
3. **Check cookies** - Verify authentication cookies exist
4. **Check React Query DevTools** - See cache state in real-time

---

**Document version:** 1.0  
**Last updated:** 2026-01-27  
**Status:** Production Ready ✅
