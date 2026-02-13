# Project Structure Documentation

## Overview

This enterprise React application follows a scalable, maintainable architecture with clear separation of concerns.

## Directory Structure

```
src/
├── app/                    # Application initialization and root component
│   ├── App.tsx            # Main App component with providers
│   └── index.ts           # App exports
│
├── api/                    # API layer - all HTTP requests
│   ├── axiosInstance.ts   # Axios instance with interceptors
│   ├── authApi.ts         # Authentication API endpoints
│   ├── userApi.ts         # User API endpoints
│   ├── dashboardApi.ts    # Dashboard API endpoints
│   └── index.ts           # API exports
│
├── components/             # Reusable UI components
│   ├── Button/            # Button component
│   ├── Input/             # Input component
│   ├── Card/              # Card component
│   ├── Loader/            # Global loader component
│   ├── layout/            # Layout components (Sidebar, Header)
│   └── index.ts           # Component exports
│
├── constants/              # Application constants
│   └── index.ts           # Routes, storage keys, HTTP status codes
│
├── core/                   # Core business logic (reserved for future use)
│
├── dto/                    # Data Transfer Objects - STRICTLY TYPED
│   ├── auth.dto.ts        # Authentication DTOs
│   ├── user.dto.ts        # User DTOs
│   ├── dashboard.dto.ts  # Dashboard DTOs
│   ├── api.dto.ts        # Generic API DTOs
│   └── index.ts          # DTO exports
│
├── features/               # Feature-specific components (reserved for future use)
│
├── guards/                 # Route guards
│   ├── AuthGuard.tsx      # Protected route guard
│   ├── GuestGuard.tsx     # Guest route guard
│   └── index.ts           # Guard exports
│
├── hooks/                  # Custom React hooks
│   └── redux.ts           # Typed Redux hooks
│
├── layouts/               # Layout components
│   └── DashboardLayout.tsx # Main dashboard layout
│
├── modules/                # Feature modules (reserved for future use)
│
├── pages/                  # Page components
│   ├── auth/              # Authentication pages
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   └── dashboard/         # Dashboard pages
│       ├── DashboardHomePage.tsx
│       ├── ProfilePage.tsx
│       └── SettingsPage.tsx
│
├── routes/                 # Routing configuration
│   └── index.tsx           # Route definitions with lazy loading
│
├── services/               # Business logic services
│   └── authService.ts     # Authentication service
│
├── store/                  # Redux store
│   ├── authSlice.ts       # Authentication state
│   ├── loaderSlice.ts     # Global loader state
│   ├── themeSlice.ts      # Theme state
│   └── index.ts           # Store configuration
│
├── theme/                  # Theme system
│   └── ThemeProvider.tsx  # Theme provider component
│
├── types/                  # TypeScript type definitions
│   └── index.ts           # Shared types
│
├── utils/                  # Utility functions
│   └── index.ts           # Helper functions (cn, formatDate, etc.)
│
├── index.css              # Global styles with Tailwind
└── main.tsx               # Application entry point
```

## Key Features

### 1. DTO Layer (`src/dto/`)

- **Purpose**: Centralized, strongly-typed data models
- **Usage**: All API requests/responses use DTOs
- **Benefits**: Type safety, maintainability, no loose typing

### 2. API Layer (`src/api/`)

- **Axios Instance**: Configured with interceptors for:
  - Cookie handling (withCredentials: true)
  - Token refresh on 401 errors
  - Global error handling
- **Typed Responses**: All APIs return typed DTOs

### 3. State Management (`src/store/`)

- **Redux Toolkit** with three slices:
  - `authSlice`: User authentication state
  - `loaderSlice`: Global loading state
  - `themeSlice`: Theme preferences

### 4. Authentication (`src/services/authService.ts`)

- Cookie-based authentication
- Automatic token refresh
- Session persistence
- Protected routes with AuthGuard

### 5. Routing (`src/routes/`)

- React Router with lazy loading
- Code splitting per route
- Protected routes with guards
- Suspense boundaries

### 6. Theme System (`src/theme/`)

- Dark/Light mode support
- Persistent theme preferences
- Smooth transitions
- Tailwind CSS integration

### 7. Components (`src/components/`)

- Reusable UI components
- Consistent styling
- Dark mode support
- Accessible components

## Type Safety

- **Strict TypeScript**: All files use strict mode
- **No `any` types**: Explicitly disabled in config
- **DTOs**: All API data is strongly typed
- **Redux**: Fully typed with TypeScript

## Code Quality

- **ESLint**: Configured with strict rules
- **Prettier**: Code formatting
- **Type Checking**: `pnpm type-check` validates all types

## Development Workflow

1. **Start Dev Server**: `pnpm dev`
2. **Type Check**: `pnpm type-check`
3. **Lint**: `pnpm lint`
4. **Format**: `pnpm format`
5. **Build**: `pnpm build`

## Environment Variables

Create `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Best Practices

1. **No inline styles**: Use Tailwind CSS classes
2. **No direct API calls**: Use services layer
3. **No business logic in components**: Use services
4. **Type everything**: No `any` types
5. **Centralized constants**: All constants in `src/constants`
6. **Reusable components**: Build once, use everywhere
