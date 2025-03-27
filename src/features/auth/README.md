
# Authentication Feature

This directory contains the authentication-related functionality for the application. It follows a feature-based organization pattern to encapsulate all authentication-related components, hooks, and utilities.

## Structure

- `/components` - React components related to authentication
- `/contexts` - Context providers for auth state management
- `/hooks` - Custom hooks for auth operations
- `/types.ts` - TypeScript types for auth-related data
- `/utils.ts` - Utility functions for auth

## Usage

### Basic Authentication

To access authentication state and methods:

```tsx
import { useAuth } from "@/features/auth";

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  
  // Use auth state and methods
}
```

### Auth Navigation

For authentication with navigation handling:

```tsx
import { useAuthNavigation } from "@/features/auth";

function LoginForm() {
  const { handleSignIn } = useAuthNavigation();
  
  const onSubmit = async (data) => {
    await handleSignIn(data.email, data.password);
    // Navigation handled automatically
  };
}
```

### Components

Ready-to-use authentication components:

```tsx
import { SignInForm, SignUpForm } from "@/features/auth";

function AuthPage() {
  return (
    <div>
      <SignInForm onTabChange={handleTabChange} />
      {/* or */}
      <SignUpForm onTabChange={handleTabChange} />
    </div>
  );
}
```

## Auth Result Pattern

All authentication operations return a standardized `AuthResult` type:

```ts
type AuthResult = 
  | { success: true; data?: any; message?: string; }
  | { success: false; error: { message: string; code?: string }; };
```

This allows for consistent error handling:

```tsx
const result = await signIn(email, password);

if (result.success) {
  // Success handling
} else {
  // Error handling with result.error.message
}
```

## Refactoring Notes

This feature module has been refactored to improve:

1. **Organization** - All auth-related code is now in a single feature directory
2. **Documentation** - Comprehensive JSDoc comments and README
3. **Type Safety** - Strong TypeScript types for all auth operations
4. **Backward Compatibility** - Legacy imports still work via re-exports

The refactoring focused on maintaining the exact same functionality while improving the code structure and readability.
