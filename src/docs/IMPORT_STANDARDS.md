
# Import Organization Standards

This document outlines our project's import organization standards to maintain consistency across the codebase.

## Import Order

We follow a specific order for imports to improve readability and maintainability:

1. **Built-in Node.js modules** (e.g., `path`, `fs`)
2. **External npm packages** (with React always first)
3. **Internal absolute imports** (using `@/` alias)
4. **Relative imports** (parent and sibling)
5. **Index imports**
6. **Type imports**

### Example:

```typescript
// Built-in modules
import path from 'path';

// External packages (React always first)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

// Internal absolute imports
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/ui/use-toast';
import { formatDate } from '@/lib/utils';

// Relative imports
import { MyComponent } from '../my-component';
import { useLocalState } from './use-local-state';

// Type imports
import type { User } from '@/types';
```

## Barrel Exports

We use barrel exports (index.ts files) to simplify imports and organize related code. This pattern allows importing multiple components from a directory with a single import statement.

### Example:

```typescript
// src/components/ui/index.ts
export * from './button';
export * from './input';
export * from './card';

// Usage elsewhere
import { Button, Input, Card } from '@/components/ui';
```

### Benefits of Barrel Exports

1. **Simplified imports**: Reduces import statement verbosity
2. **Organized code**: Keeps related functionality grouped together
3. **Easy refactoring**: Moving files requires fewer import updates
4. **Better readability**: Cleaner import sections make code easier to understand

## Naming Conventions

- Use **PascalCase** for components, interfaces, and type aliases
- Use **camelCase** for functions, variables, and instances
- Use **kebab-case** for file names (e.g., `auth-context.tsx`)
- Use **SCREAMING_SNAKE_CASE** for constants and environment variables

## When to Use Barrel Exports

- Create barrel exports for feature modules with multiple components
- Create barrel exports for hooks related to a specific domain
- Create barrel exports for utility functions grouped by purpose
- Avoid overly complex barrel exports that might impact tree-shaking
