
# Project Directory Structure

This document outlines the organization of our codebase to help maintain consistency and make it easier for developers to navigate the project.

## Core Principles

1. **Consistent Naming Conventions**
   - Files use kebab-case (e.g., `auth-context.tsx`)
   - Components, hooks, and other exports use PascalCase (e.g., `AuthContext`)
   - Type definitions use PascalCase with descriptive names (e.g., `AuthContextType`)

2. **Feature-Based Organization**
   - Components are grouped by feature or domain
   - Related hooks and utilities are organized in corresponding directories

## Directory Structure

### `/components`
Contains all React components organized by feature/domain:

- `/components/ui`: Reusable UI components (buttons, inputs, cards, etc.)
- `/components/auth`: Authentication-related components (login forms, auth containers)
- `/components/checkout`: Checkout flow components
- `/components/home`: Homepage-specific components

### `/contexts`
Contains React Context providers for global state management:

- `auth-context.tsx`: Authentication context for user session management

### `/hooks`
Custom React hooks organized by domain:

- `/hooks/auth`: Authentication-related hooks
  - `useAuthActions.ts`: Handles auth operations (signup, signin, etc.)
  - `useAuthNavigation.ts`: Handles navigation after auth actions

- `/hooks/data`: Data fetching and management hooks
  - `useProfile.ts`: Fetches and manages user profile data
  - `useAdminStatus.ts`: Determines if a user has admin privileges

- `/hooks/ui`: UI-related hooks
  - `use-toast.ts`: Toast notification hook

### `/lib`
Utility functions and constants:

- `utils.ts`: General utility functions
- `data.ts`: Static data and constants

### `/pages`
Page components that represent routes in the application.

### `/integrations`
External service integrations:

- `/integrations/supabase`: Supabase client and related utilities
- `/integrations/stripe`: Stripe payment integration

## Import Conventions

- Always use absolute imports with the `@/` alias
- Group imports by type (React, external libraries, internal components)
- Example:
  ```tsx
  // React and external libraries first
  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  
  // Internal components, hooks, utilities
  import { Button } from "@/components/ui/button";
  import { useAuth } from "@/contexts/auth-context";
  import { formatDate } from "@/lib/utils";
  ```

## Best Practices

1. **Component Creation**
   - Create small, focused components with single responsibilities
   - Extract reusable logic into custom hooks
   - Keep UI components separate from business logic

2. **State Management**
   - Use React Context for global state that needs to be accessed by many components
   - Use local state for component-specific state
   - Consider using React Query for server state management
