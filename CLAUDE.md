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
- **Protected Layouts**: 
  - `ProtectedUserLayout.tsx` - General authenticated users
  - `ProtectedAdminLayout.tsx` - Admin-only routes

### Routing Structure
- **React Router v7**: File-based routing with layouts and nested routes
- **Route Configuration**: Centralized in `app/routes.ts`
- **Layout Hierarchy**: Admin routes nested under admin layout, user routes under user layout
- **Public Routes**: Authentication pages (login, signup, password reset)

### UI Components
- **shadcn/ui**: Complete component library in `app/components/ui/`
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