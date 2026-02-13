# Enterprise React Application

A production-ready React application built with TypeScript, Vite, React Query, Redux Toolkit, and Tailwind CSS.

## Features

- ✅ **TypeScript** with strict mode (no `any` types)
- ✅ **Vite** for fast development and optimized builds
- ✅ **React Query (TanStack Query)** for server state management
- ✅ **Redux Toolkit** for UI/client-only state management
- ✅ **React Router** with lazy loading and code splitting
- ✅ **Tailwind CSS** with dark/light theme support
- ✅ **Cookie-based authentication** with HttpOnly cookies
- ✅ **Centralized DTO layer** for type safety
- ✅ **Axios** with robust refresh token handling
- ✅ **Protected routes** with AuthGuard
- ✅ **Global loader** system
- ✅ **Error boundaries** with fallback UI
- ✅ **Vitest** for unit and integration testing
- ✅ **ESLint + Prettier** for code quality

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Query (TanStack Query)** - Server state management
- **Redux Toolkit** - UI/client state management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework
- **Lucide React** - Icons
- **ESLint + Prettier** - Code quality

## Architecture

### State Management

- **React Query**: Manages all server state (API data, authentication, user profiles, dashboard data)
- **Redux Toolkit**: Manages only UI/client state (theme preferences, loader state, UI flags)

This separation ensures:

- Server state is automatically cached, refetched, and synchronized
- No duplicate state between Redux and React Query
- Better performance with automatic background updates
- Simplified data fetching logic

### Project Structure

```
src/
  app/              # App initialization
  api/              # API layer (axios instance, API functions)
  components/       # Reusable UI components
    dashboard/       # Dashboard-specific components
  guards/           # Route guards
  hooks/
    queries/        # React Query hooks
    redux.ts        # Redux hooks
  layouts/          # Layout components
  lib/              # Library configurations (React Query setup)
  pages/            # Page components
  routes/           # Route configuration
  services/         # Business logic services
  store/            # Redux store (UI state only)
  theme/            # Theme configuration
  types/            # TypeScript types
  utils/            # Utility functions
  dto/              # Data Transfer Objects
  constants/        # Application constants
  test/             # Test setup and utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Update `.env` with your API base URL:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
pnpm build
```

### Preview

Preview production build:

```bash
pnpm preview
```

### Testing

Run tests:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

Run tests with coverage:

```bash
pnpm test:coverage
```

### Code Quality

Lint code:

```bash
pnpm lint
```

Format code:

```bash
pnpm format
```

Type check:

```bash
pnpm type-check
```

## Authentication

The application uses cookie-based authentication with HttpOnly cookies. The authentication flow includes:

- Login/Register pages
- Robust token refresh handling (prevents infinite loops, handles concurrent requests)
- Protected routes with AuthGuard
- Automatic session persistence
- Role-based access control

### Refresh Token Flow

The Axios interceptor handles token refresh with:

- Maximum retry limit (prevents infinite loops)
- Concurrent request queuing (prevents multiple refresh attempts)
- Automatic logout on refresh failure
- Skip logic for auth endpoints

## API Integration

All API calls go through a centralized Axios instance with:

- Automatic cookie handling
- Robust token refresh interceptors
- Global error handling and normalization
- Typed responses using DTOs
- Standardized error messages

### React Query Hooks

Server state is managed through React Query hooks:

- `useCurrentUser()` - Get current authenticated user
- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation
- `useUserProfile()` - Get user profile
- `useUpdateProfile()` - Update user profile
- `useDashboardStats()` - Get dashboard statistics
- `useDashboardWidgets()` - Get dashboard widgets

## State Management

### React Query (Server State)

- Authentication state
- User profiles
- Dashboard data
- All API-fetched data

### Redux Toolkit (UI State)

- **themeSlice** - Theme preferences (light/dark mode)
- **loaderSlice** - Global loading state
- **authSlice** - UI-only authentication flag

## Error Handling

- **Error Normalization**: All API errors are normalized to a consistent format
- **User-Friendly Messages**: HTTP status codes are mapped to user-friendly messages
- **Error Boundaries**: React error boundaries catch and display errors gracefully
- **Toast Notifications**: User-facing error messages via react-hot-toast

## Component Architecture

Components are kept small and focused:

- No component exceeds ~250-300 lines
- Data fetching logic extracted to React Query hooks
- Complex logic extracted to custom hooks
- Reusable components in `components/` directory

## Testing

Tests are written using Vitest and React Testing Library:

- Unit tests for utilities and hooks
- Integration tests for key flows (auth, data loading)
- Test setup includes mocks for browser APIs

## Environment Variables

Required environment variables:

- `VITE_API_BASE_URL` - Backend API base URL
