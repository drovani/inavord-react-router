# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **inavord-react-router** template - a modern React Router v7 application with Supabase authentication, Tailwind CSS v4, and Netlify deployment. It's designed as a foundation template for building full-stack React applications with authentication and role-based access control.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (includes Netlify preparation)
- `npm run start` - Start production server using Netlify
- `npm run tsc` - Run TypeScript type checking and generate route types
- `npm run supabase:types` - Generate Supabase types from local database

## Architecture

### Authentication & Authorization
- **Supabase Auth**: Complete authentication system with email/password, OAuth providers
- **AuthContext**: Centralized auth state management (`app/contexts/AuthContext.tsx`)
- **Role-based Access**: Users have roles array, routes can be restricted by role
- **Default Roles**: New users get `['user']` role, admins can assign `admin`, `editor`, `user` roles
- **Protected Layouts**: 
  - `ProtectedUserLayout.tsx` - General authenticated users
  - `ProtectedAdminLayout.tsx` - Admin-only routes
- **User Management**: Admin page at `/admin/users` (requires service role for full functionality)

### Routing Structure
- **React Router v7**: File-based routing with layouts and nested routes
- **Route Configuration**: Centralized in `app/routes.ts`
- **Layout Hierarchy**: Admin routes nested under admin layout, user routes under user layout
- **Public Routes**: Authentication pages (login, signup, password reset)

### UI Components
- **shadcn/ui**: Complete component library in `app/components/ui/`
- **Component Installation**: ALWAYS use `npx shadcn@latest add [component-name]` to install shadcn/ui components
- **Tailwind CSS v4**: Utility-first styling with CSS variables for theming
- **Sidebar Navigation**: Collapsible sidebar with role-based menu items
- **Responsive Design**: Mobile-first approach with custom hooks (`useIsMobile.tsx`)

### Data Layer
- **Supabase Client**: SSR-compatible client creation (`app/lib/supabase/client.ts`)
- **Repository Pattern**: Base repository class for CRUD operations (to be implemented)
- **Type Safety**: Generated Supabase types and strict TypeScript

### Navigation System
- **Dynamic Navigation**: Role-based menu items defined in `app/data/navigation.ts`
- **Breadcrumbs**: Automatic breadcrumb generation based on route hierarchy
- **Site Components**: `SiteSidebar.tsx`, `SiteHeader.tsx`, `SiteUserMenu.tsx`

## Key Files to Understand

- `app/routes.ts` - Route configuration and hierarchy
- `app/contexts/AuthContext.tsx` - Authentication state management
- `app/data/navigation.ts` - Navigation menu structure
- `app/lib/supabase/client.ts` - Supabase client configuration
- `app/layouts/` - Layout components for different user types

## Environment Setup

Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon public key

Optional for full user management:
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin user management functions

## Deployment

- **Netlify**: Configured for automatic deployment
- **Build Process**: Vite build + custom Netlify preparation script
- **Static Files**: Immutable caching for fingerprinted assets

## Development Notes

- TypeScript strict mode - no `any` types allowed
- All auth flows handle SSR/client-side hydration
- Components follow shadcn/ui patterns and conventions
- Responsive design uses Tailwind breakpoints and custom mobile detection
- Role-based access control is enforced at both route and component levels

## Component Development Guidelines

- **Use shadcn CLI**: When adding UI components, always use `npx shadcn@latest add [component-name]` instead of manually creating components
- **Check Available Components**: Before creating custom components, verify if shadcn/ui has an official version
- **Component Consistency**: All UI components should follow shadcn/ui patterns for styling and structure
- **Manual Components**: Only create manual components when shadcn/ui doesn't provide the needed functionality
- **Pre-Installation Check**: Before calling shadcn cli, check to see if the component already exists in the repo

## Development Best Practices

- Use loglevel for error logging and debugging instead of using console
- After completing a task with code changes, run `npm run tsc` to test for Typescript errors

## Testing Framework

The project uses **Vitest** with React Testing Library for comprehensive testing:

### Available Test Commands
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI interface

### Test Structure
- **Unit Tests**: Components, hooks, utility functions
- **Integration Tests**: API business logic, auth flows (mocked)
- **Repository Tests**: Supabase database operations (mocked)

### Testing Guidelines
- **Components**: Test rendering, interactions, props, and accessibility
- **Hooks**: Test state changes, effects, and edge cases  
- **Business Logic**: Test validation, permissions, and error handling
- **Supabase Operations**: Mock the client and test query building and data transformation

### Test Files Location
- Component tests: `app/components/**/*.test.tsx`
- Hook tests: `app/hooks/**/*.test.tsx`
- Context tests: `app/contexts/**/*.test.tsx`
- Example patterns: `app/__tests__/examples/`
- Test utilities: `app/__tests__/utils/`
- Mocks: `app/__tests__/mocks/`

### Mocking Patterns
- **Supabase Client**: Use `app/__tests__/mocks/supabase.ts` for database operations
- **Auth Context**: Mock authentication state for component testing
- **External APIs**: Use MSW for HTTP request mocking
- **Browser APIs**: Mock matchMedia, IntersectionObserver, etc.

## Tailwind CSS Guidelines

- **Square Elements**: When an element has identical height and width classes (e.g., `h-8 w-8`), always use the `size` property instead (e.g., `size-8`)
- **Consistency**: This rule applies to all square dimensions including icons, avatars, buttons, and other square UI elements

## User Role Management

- **Initial Admin Setup**: Use SQL Editor in Supabase Dashboard to assign initial admin role:
  ```sql
  UPDATE auth.users 
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'), 
    '{roles}', 
    '["admin"]'
  ) 
  WHERE email = 'your-email@example.com';
  ```
- **Available Roles**: `admin`, `editor`, `user` (new users default to `user`)
- **Role Assignment**: Admins can manage user roles through `/admin/users` page (requires service role configuration)