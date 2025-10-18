# Unit Converter - AI Coding Agent Instructions

**Last Updated:** October 18, 2025  
**Maintainer:** @rhoofr
**Version:** 0.2.0

## Core Technologies

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5+ (strict mode)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 + shadcn/ui (New York style)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono

## Guiding Principles

1. **Type Safety First**: Leverage TypeScript's strict mode for all components and utilities
2. **Responsive by Default**: All components must work seamlessly on mobile, tablet, and desktop
3. **Accessibility**: Follow ARIA standards and semantic HTML practices
4. **Performance**: Utilize React Server Components (RSC) where possible, client components only when needed
5. **Consistency**: Use shadcn/ui components and semantic color classes for uniform design
6. **Clean Architecture**: Separate concerns with clear directory structure and path aliases
7. **Design**: Maintain visual harmony and user experience consistency using modern design principles

## Directory Structure (App Router)

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles, theme variables
│   └── [feature]/         # Feature-based routing
├── components/
│   └── ui/                # shadcn/ui components (auto-generated)
├── lib/
│   └── utils.ts           # Utility functions (cn() helper)
└── hooks/                 # Custom React hooks (create as needed)
```

**Path Aliases:**

- `@/*` → `./src/*`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`

## TypeScript Conventions

- **Strict Mode**: Always enabled (`strict: true` in `tsconfig.json`)
- **Type Imports**: Use `import type` for type-only imports
  ```typescript
  import type { Metadata } from 'next';
  import type { ComponentProps } from 'react';
  ```
- **Component Props**: Define explicit interfaces, avoid inline types

  ```typescript
  interface ButtonProps {
    variant?: 'default' | 'destructive' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
  }

  export function Button({ variant = 'default', size = 'md', children }: ButtonProps) {
    // ...
  }
  ```

- **Avoid `any`**: Use `unknown` or proper types; if truly needed, add `// @ts-expect-error` with explanation
- **Target**: ES2017 for modern browser support

## React & Next.js (App Router) Conventions

### Server Components (Default)

- Use React Server Components (RSC) by default for better performance
- No `"use client"` directive unless component needs:
  - State (`useState`, `useReducer`)
  - Effects (`useEffect`, `useLayoutEffect`)
  - Event handlers (onClick, onChange, etc.)
  - Browser-only APIs (localStorage, window, etc.)

### Client Components

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Metadata

- Define in `layout.tsx` or `page.tsx` using `Metadata` type

  ```typescript
  import type { Metadata } from 'next';

  export const metadata: Metadata = {
    title: 'Unit Converter',
    description: 'Convert between different units of measurement',
  };
  ```

### Responsive Design

- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Mobile-first approach (base styles for mobile, breakpoints for larger screens)
  ```typescript
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  ```

## Tailwind CSS Conventions

### Using the `cn()` Utility

- **Always use** `cn()` from `@/lib/utils` to merge classes conditionally

  ```typescript
  import { cn } from '@/lib/utils';

  <div
    className={cn(
      'rounded-lg border p-4',
      isActive && 'bg-accent',
      className // Allow prop-based overrides
    )}
  />;
  ```

### Responsive Patterns

```typescript
// Mobile-first grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" />

// Responsive padding/spacing
<section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12" />

// Responsive text sizes
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" />

// Responsive flexbox
<div className="flex flex-col sm:flex-row gap-4" />
```

### CSS Variables (OKLCH Color Space)

- All colors defined in `globals.css` using OKLCH for better color perception
- Dark mode via `.dark` class on root element
- Global radius: `--radius: 0.625rem` (10px)
- Custom variants: Use `@custom-variant dark (&:is(.dark *))`

## shadcn/ui Semantic Color Classes

**Use semantic color classes instead of hardcoded colors:**

```typescript
// ✅ CORRECT - Semantic classes
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground border border-border">
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
<div className="bg-muted text-muted-foreground">
<div className="bg-destructive text-destructive-foreground">
<input className="border-input bg-background ring-ring">

// ❌ AVOID - Hardcoded colors
<div className="bg-white text-black dark:bg-gray-900">
```

**Available Semantic Colors:**

- `background` / `foreground` - Main background and text
- `card` / `card-foreground` - Card backgrounds
- `popover` / `popover-foreground` - Popover/dropdown backgrounds
- `primary` / `primary-foreground` - Primary actions
- `secondary` / `secondary-foreground` - Secondary actions
- `muted` / `muted-foreground` - Muted/disabled states
- `accent` / `accent-foreground` - Accent highlights
- `destructive` / `destructive-foreground` - Destructive actions
- `border` - Border colors
- `input` - Input borders
- `ring` - Focus ring colors

## Form Handling with React Hook Form and Zod

### Pattern to Follow

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define Zod schema
const formSchema = z.object({
  value: z.number().positive('Value must be positive'),
  fromUnit: z.string().min(1, 'Please select a unit'),
  toUnit: z.string().min(1, 'Please select a unit'),
});

type FormData = z.infer<typeof formSchema>;

// 2. Use in component
export function ConversionForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 0,
      fromUnit: '',
      toUnit: '',
    },
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>;
}
```

### Installing Form Components

```bash
npx shadcn@latest add form input select button label
```

## Component Development Workflow

### Installing shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
# Examples:
npx shadcn@latest add button card input select
```

Components appear in `@/components/ui` and can be imported:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
```

### Custom Component Pattern

```typescript
// src/components/conversion-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ConversionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ConversionCard({ title, children, className }: ConversionCardProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## Unit Test Creation & Update Process

**Note:** Testing framework not yet configured. When adding tests:

1. Install dependencies:

   ```bash
   npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
   ```

2. Create test files adjacent to components: `*.test.tsx` or `*.spec.tsx`

3. Follow this pattern:

   ```typescript
   import { render, screen } from '@testing-library/react';
   import { Button } from './button';

   describe('Button', () => {
     it('renders children correctly', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
   });
   ```

## Linting and Formatting

### ESLint

```bash
npm run lint          # Check for errors
npm run lint --fix    # Auto-fix issues (when added to scripts)
```

**Configuration:** Flat config in `eslint.config.mjs` with Next.js core-web-vitals + TypeScript rules

**Ignored paths:**

- `node_modules/**`
- `.next/**`
- `out/**`
- `build/**`
- `next-env.d.ts`

### Code Style

- Prefer **arrow functions** for components and utilities
- Use **named exports** for components (not default exports, except pages)
- **2-space indentation** (standard Next.js convention)

## Things to Avoid

### ❌ Don't Do This

```typescript
// Don't use hardcoded colors
<div className="bg-white dark:bg-gray-900">

// Don't skip responsive design
<div className="w-[500px]"> // Fixed width breaks mobile

// Don't use client components unnecessarily
"use client"
export default function StaticContent() { /* no interactivity */ }

// Don't skip TypeScript types
function myFunction(data: any) { /* avoid any */ }

// Don't hardcode values that should be configurable
const MAX_VALUE = 100 // Should be in a config file

// Don't chain optional chaining excessively
data?.user?.profile?.settings?.theme?.color // Consider restructuring

// Don't mix semantic and non-semantic classes
<button className="bg-primary bg-blue-500"> // Conflicting classes
```

### ✅ Do This Instead

```typescript
// Use semantic color classes
<div className="bg-background text-foreground">

// Use responsive utilities
<div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl">

// Use server components by default
export default function StaticContent() { /* RSC by default */ }

// Properly type everything
function myFunction(data: UserData) { /* explicit type */ }

// Extract to config
export const APP_CONFIG = { MAX_VALUE: 100 } as const

// Use proper null checking with types
const color = data?.user?.profile?.settings?.theme?.color ?? "default"

// Use only semantic classes
<button className="bg-primary hover:bg-primary/90">
```

## Essential Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (validates types & linting)
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

## Key Files Reference

- `src/app/layout.tsx` - Root layout with Geist fonts and metadata
- `src/app/globals.css` - Tailwind config, OKLCH theme variables, dark mode
- `src/lib/utils.ts` - Utility functions (`cn()` class merger)
- `components.json` - shadcn/ui configuration (New York style, RSC enabled)
- `tsconfig.json` - TypeScript paths (`@/*`) and strict mode settings
- `eslint.config.mjs` - ESLint flat config with Next.js + TypeScript rules
- `postcss.config.mjs` - PostCSS with Tailwind v4 plugin
