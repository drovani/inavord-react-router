# inavord-react-router Template Creation Instructions

## Project Overview
Transform the Hero Wars Helper application into a reusable React Router v7 template called "inavord-react-router". This template will serve as a foundation for future applications with authentication, authorization, data management, and a consistent UI pattern.

## Source Repository
- **Hero Wars Helper**: Contains the full application with game-specific code to be stripped out
- **Target Repository**: inavord-react-router (will be provided)

## Key Requirements
1. **Framework**: React Router v7 with TypeScript (no `any` types)
2. **Styling**: Tailwind CSS v4 with latest shadcn/ui components
3. **Authentication**: Supabase Auth with role-based access control
4. **Database**: Supabase with RLS, BaseRepository pattern for data access
5. **Deployment**: Netlify-ready (no Netlify Blobs)
6. **Dev Server**: Vite
7. **Theme**: Keep current neutral theme

## Core Features to Preserve
- Sidebar navigation with collapsible states
- User menu at bottom of sidebar
- Breadcrumb navigation system
- Protected routes based on user roles
- Styled authentication pages (login, signup, forgot password, update password)
- Account management section
- Admin section for JSON data import/export
- Responsive design patterns

## Step-by-Step Transformation Plan

### Phase 1: Setup & Dependencies
1. Update `package.json`:
   - Name: "inavord-react-router"
   - Description: "A modern React Router v7 template with Supabase authentication and authorization"
   - Update ALL dependencies to latest versions
   - Remove any Hero Wars specific dependencies

2. Update shadcn/ui components to latest versions using their CLI

3. Clean `public/` directory:
   - Remove all directories except essential ones
   - Remove all Hero Wars images
   - Keep only generic placeholder assets

### Phase 2: Remove Game-Specific Code

1. **Data files to remove** from `/app/data/`:
   - `equipment.zod.ts`
   - `hero.zod.ts`
   - `mission.zod.ts`
   - `equipments.json`
   - `heroes.json`
   - `missions.json`
   - `ReadonlyArrays.ts`

2. **Services to remove** from `/app/services/`:
   - `HeroDataService.ts`
   - `EquipmentDataService.ts`
   - `MissionDataService.ts`
   - `BaseDataService.ts` (will be replaced)

3. **Components to remove**:
   - Entire `/app/components/hero/` directory
   - Entire `/app/components/hero-form/` directory
   - Entire `/app/components/equipment-form/` directory
   - `HeroForm.tsx`
   - `EquipmentForm.tsx`
   - `EquipmentImage.tsx`

4. **Routes to remove** from `/app/routes/`:
   - All `heroes.*` files
   - All `equipment.*` files
   - All `missions.*` files
   - All `titans.*` files
   - Remove corresponding route entries from `routes.ts`

5. **Update `/app/data/navigation.tsx`**:
   - Remove Heroes, Equipment, Missions, Titans entries
   - Keep structure but make generic

### Phase 3: Create Generic Data Infrastructure

1. **Create `/app/services/BaseRepository.ts`**:
```typescript
// Abstract class for Supabase CRUD operations
// Should include:
// - Generic type parameters for table schema
// - Constructor accepting table name
// - Common CRUD methods (getAll, getById, create, update, delete)
// - Error handling
// - RLS support
// - Pagination support
// - Filtering/sorting support
```

2. **Create `/app/services/UserRepository.ts`** as example implementation

3. **Set up Supabase types**:
   - Add script to `package.json` for generating types
   - Create `/app/types/supabase.ts` for generated types
   - Create initial type definitions for users and roles

4. **Create JSON import/export system**:
   - Update `/app/routes/admin.setup.tsx` to be generic
   - Create import functionality that accepts table name and JSON data
   - Create export functionality that downloads table data as JSON
   - Remove Hero Wars specific initialization logic

### Phase 4: Update Authentication & Authorization

1. **Update `/app/contexts/AuthContext.tsx`**:
   - Remove any Hero Wars specific logic
   - Ensure it works with generic user profiles

2. **Update `/app/lib/supabase/client.ts`** if needed

3. **Create Supabase migrations** in `/supabase/migrations/`:
   - Users profile table with proper RLS
   - Roles table and user_roles junction table
   - RLS policies for authenticated access

4. **Ensure all auth routes are generic**:
   - `/app/routes/login.tsx`
   - `/app/routes/sign-up.tsx`
   - `/app/routes/forgot-password.tsx`
   - `/app/routes/update-password.tsx`
   - `/app/routes/auth.confirm.tsx`
   - `/app/routes/auth.error.tsx`

### Phase 5: Update UI & Navigation

1. **Update `/app/routes/_index.tsx`**:
   - Remove all Hero Wars content
   - Create generic template landing page
   - Include sections for feature highlights
   - Add placeholder content

2. **Update `/app/root.tsx`**:
   - Update meta tags to be generic
   - Update title to "inavord-react-router"
   - Remove Hero Wars specific imports

3. **Update `/app/components/SiteSidebar.tsx`**:
   - Remove Hero Wars logo references
   - Use generic app name and branding

4. **Update `/app/components/SiteHeader.tsx`** if needed

5. **Clean up any remaining Hero Wars references** in:
   - `/app/lib/utils.ts`
   - Any other utility files

### Phase 6: Documentation & Configuration

1. **Create new README.md** with:
   - Project overview
   - Prerequisites (Node.js version, Supabase account, etc.)
   - Initial setup instructions
   - Supabase configuration guide
   - Environment variables explanation
   - Customization guide
   - Deployment instructions for Netlify

2. **Create `.env.example`**:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. **Update configuration files**:
   - `netlify.toml`
   - `vite.config.ts`
   - `tailwind.config.ts`
   - Any other config files

### Phase 7: Testing & Cleanup

1. **Remove any remaining Hero Wars references** by searching for:
   - "hero", "equipment", "mission", "titan"
   - "Hero Wars"
   - Game-specific terms

2. **Test all functionality**:
   - Authentication flows (signup, login, logout, password reset)
   - Protected routes with different roles
   - Admin data import/export
   - Responsive design
   - Build process

3. **TypeScript validation**:
   - Run `npm run tsc` to ensure no type errors
   - No use of `any` type

4. **Production build test**:
   - Run `npm run build`
   - Test the built application

## Expected File Structure (Key Directories)
```
inavord-react-router/
├── app/
│   ├── components/
│   │   ├── ui/           (shadcn components)
│   │   └── Site*.tsx     (navigation components)
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/
│   │   └── navigation.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   └── utils.ts
│   ├── routes/
│   │   ├── _index.tsx
│   │   ├── account*.tsx
│   │   ├── admin*.tsx
│   │   ├── auth*.tsx
│   │   ├── login.tsx
│   │   └── ...
│   ├── services/
│   │   ├── BaseRepository.ts
│   │   └── UserRepository.ts
│   └── types/
│       └── supabase.ts
├── supabase/
│   └── migrations/
└── public/
```

## Important Notes
- Do NOT include any Hero Wars specific code or references
- Ensure all TypeScript is properly typed (no `any`)
- Keep the routing structure and patterns from the original
- Maintain the current authentication flow with Supabase
- The template should be immediately usable for new projects
- All UI components should use the latest shadcn/ui versions

## Questions to Ask Before Each Phase
Before starting each phase, confirm:
1. Are there any specific files in this phase that should be preserved?
2. Are there any additional considerations for this section?
3. Should I proceed with the changes as outlined?

This template will serve as a foundation for future React Router applications with built-in authentication, authorization, and data management patterns.