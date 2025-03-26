
# Feature Folders Architecture

This directory contains the application's features organized by domain rather than technical role. This approach helps encapsulate related code together, making it easier to understand and maintain.

## Structure

Each feature folder follows a similar structure:

```
src/features/feature-name/
│
├── components/       # React components specific to this feature
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
│
├── hooks/            # Custom React hooks for this feature
│   ├── useFeatureHookA.ts
│   └── useFeatureHookB.ts
│
├── services/         # Services handling business logic and API calls
│   └── featureService.ts
│
├── types.ts          # TypeScript types and interfaces
├── utils.ts          # Utility functions specific to this feature
└── index.ts          # Public API exports
```

## Benefits

- **Cohesion**: Related code is located together
- **Encapsulation**: Features are self-contained with clear boundaries
- **Discoverability**: Easier to find all code related to a feature
- **Maintainability**: Changes to a feature are localized to its folder
- **Scalability**: New features can be added without affecting existing ones

## Implementation

When implementing a new feature:

1. Create a new folder in `src/features/`
2. Add components, hooks, and services specific to that feature
3. Define types in a `types.ts` file
4. Export the public API in an `index.ts` file

## Current Features

- **file-upload**: Handles file upload functionality, including UI components and state management
- **auth**: Authentication and authorization features (login, signup, etc.)
- **questionnaire**: Business information collection and onboarding
- **checkout**: Payment processing and order management
- **milestone**: User achievement tracking and rewards

## Guidelines

- Keep feature folders focused on a single domain
- Avoid cross-feature dependencies when possible
- Use the shared UI components from `src/components/ui`
- Place shared utilities in `src/utils`
- Use feature index files to control what is publicly exposed
