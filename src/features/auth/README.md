
# Authentication Feature

This module provides a complete authentication solution for the application, including:

- User sign-up and sign-in forms
- Password reset functionality
- Authentication context and hooks
- Welcome coupon for new users

## Components

- `AuthContainer`: Wrapper component with consistent styling for auth forms
- `AuthMessage`: Displays authentication-related messages and notifications
- `SignInForm`: Form for user login
- `SignUpForm`: Form for new user registration
- `WelcomeCoupon`: Displays special discounts for new users

## Hooks

- `useAuth`: Main hook for accessing authentication context
- `useAuthActions`: Provides authentication actions (sign in, sign up, etc.)
- `useAuthNavigation`: Navigation-related auth actions with redirect handling
- `useAuthData`: Access to user authentication data

## Usage

```tsx
import { useAuth, SignInForm } from '@/features/auth';

function MyAuthComponent() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <SignInForm onTabChange={() => {}} />
      )}
    </div>
  );
}
```

## Context

The `AuthContextProvider` should be placed near the root of your application:

```tsx
import { AuthContextProvider } from '@/features/auth';

function App() {
  return (
    <AuthContextProvider>
      {/* Your app components */}
    </AuthContextProvider>
  );
}
```
