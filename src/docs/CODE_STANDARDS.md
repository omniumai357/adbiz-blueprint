
# Code Standards

This document outlines the coding standards and patterns used in this project to maintain consistency and improve maintainability.

## Import Organization

We follow a consistent import ordering pattern enforced by ESLint rules:

1. **Built-in Node.js modules** (e.g., `path`, `fs`)
2. **External npm packages** (with React always first)
3. **Internal absolute imports** (using `@/` alias)
4. **Relative imports** (parent and sibling)
5. **Index imports**
6. **Type imports**

Example of properly ordered imports:

```typescript
// Built-in modules (if any)
import path from 'path';

// External packages (React always first)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

// Internal absolute imports
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/ui/use-toast';
import { formatDate } from '@/lib/utils';

// Relative imports (parent/sibling)
import { MyComponent } from '../my-component';
import { useLocalState } from './use-local-state';

// Type imports
import type { User } from '@/types';
```

## Barrel Exports

We use barrel exports (index.ts files) to simplify imports and organize related code:

```typescript
// src/components/ui/index.ts
export * from './button';
export * from './input';
export * from './card';
```

This allows importing multiple components with a single import:

```typescript
import { Button, Input, Card } from '@/components/ui';
```

## Service Registry Pattern

We use a service registry pattern to manage dependencies in a more maintainable way:

### Registering Services

Services are registered in `src/services/registry/service-registry.ts` and initialized once at application startup:

```typescript
// Example service registration
serviceRegistry.register('api', apiClient);
```

### Using Services in Components

Services can be accessed in components using the `useService` hook:

```typescript
import { useService } from '@/hooks/services/useService';

function MyComponent() {
  const api = useService('api');
  
  // Use the API client...
}
```

### Benefits of the Service Registry

1. **Testability**: Services can be easily mocked for testing
2. **Maintainability**: Service dependencies are centralized
3. **Discoverability**: Single entry point for all services
4. **Type Safety**: Fully typed service access

## Code Organization

1. **Feature-based Organization**: Components, hooks, and utilities are grouped by feature or domain
2. **Small, Focused Components**: Components should have a single responsibility
3. **Business Logic Separation**: Business logic is extracted into custom hooks
4. **Consistent Naming**: Kebab-case for files, PascalCase for components/types

See `DIRECTORY_STRUCTURE.md` for more details on project organization.
