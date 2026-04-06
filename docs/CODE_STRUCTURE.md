# Readdly Admin - Code Structure & Organization

## 📁 Project Structure

```
readdly-web-admin/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard pages
│   ├── login/                   # Authentication pages
│   └── layout.tsx              # Root layout
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx          # Enhanced button component
│   │   ├── Card.tsx            # Enhanced card component
│   │   └── ...                 # Other UI components
│   └── layout/                 # Layout components
│       ├── Sidebar.tsx          # Navigation sidebar
│       └── Header.tsx          # App header
├── features/                   # Feature-specific components
│   └── dashboard/              # Dashboard features
│       ├── components/         # Dashboard-specific components
│       │   ├── ChartsSection.tsx
│       │   ├── StatsGrid.tsx
│       │   └── ...
│       └── hooks/              # Dashboard-specific hooks
├── hooks/                      # Global custom hooks
│   ├── useAuth.ts             # Authentication hook
│   ├── useAdminStats.ts       # Admin statistics hook
│   └── useSidebar.ts          # Sidebar state hook
├── contexts/                   # React contexts
│   └── SidebarContext.tsx     # Sidebar state management
├── services/                   # API and data services
│   ├── auth.ts                # Authentication service
│   └── api.ts                 # API client
├── utils/                      # Utility functions
│   ├── constants.ts           # App constants
│   ├── formatters.ts          # Data formatters
│   └── helpers.ts             # Helper functions
├── styles/                     # Global styles
│   ├── globals.css            # Global styles
│   ├── theme.css              # Theme variables
│   ├── variables.css          # CSS variables
│   └── auth.css               # Auth-specific styles
└── docs/                      # Documentation
    ├── CODE_STRUCTURE.md      # This file
    └── ...
```

## 🎨 CSS Organization

### Theme System
- **`theme.css`**: Contains all CSS variables, colors, spacing, typography
- **`globals.css`**: Global styles, base resets, utility classes
- **Component-specific**: Styles are co-located with components

### CSS Variables Structure
```css
:root {
  /* Colors - Same as login page */
  --color-primary: #5f6ad8;
  --color-bg-light: #edeffa;
  /* ... */
  
  /* Spacing */
  --space-sm: 0.5rem;
  --space-md: 1rem;
  /* ... */
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  /* ... */
}
```

## 🧩 Component Architecture

### UI Components (`components/ui/`)
- **Purpose**: Reusable, generic components
- **Examples**: Button, Card, Input, Modal
- **Characteristics**: 
  - No business logic
  - Highly configurable via props
  - Consistent styling with theme

### Layout Components (`components/layout/`)
- **Purpose**: App layout and navigation
- **Examples**: Sidebar, Header, Footer
- **Characteristics**:
  - Handle app structure
  - Manage navigation state
  - Responsive behavior

### Feature Components (`features/`)
- **Purpose**: Feature-specific, business logic
- **Examples**: Dashboard charts, User management
- **Characteristics**:
  - Contain business logic
  - Feature-specific hooks
  - Domain-specific styling

## 🔧 Custom Hooks

### Global Hooks (`hooks/`)
```typescript
// useAuth.ts - Authentication state
export function useAuth() {
  // User state, login, logout, etc.
}

// useAdminStats.ts - Dashboard statistics
export function useAdminStats() {
  // Fetch and manage admin stats
}
```

### Feature Hooks (`features/*/hooks/`)
- Feature-specific logic
- Reusable within the feature
- Isolated from global state

## 🛠 Services Layer

### Authentication Service (`services/auth.ts`)
```typescript
export class AuthService {
  login(email: string, password: string)
  logout()
  isAuthenticated()
  getCurrentUser()
}
```

### API Service (`services/api.ts`)
- HTTP client configuration
- Request/response interceptors
- Error handling

## 🎯 Best Practices

### 1. Component Organization
- **Single Responsibility**: Each component has one clear purpose
- **Co-location**: Styles, hooks, and components related to each other are placed together
- **Reusability**: Generic components in `/ui`, specific components in `/features`

### 2. State Management
- **Local State**: useState for component-specific state
- **Global State**: Context for app-wide state (sidebar, auth)
- **Server State**: Custom hooks for API data

### 3. Styling Approach
- **CSS Variables**: Centralized theme system
- **Utility Classes**: For common patterns
- **Component Styles**: Co-located with components
- **Responsive Design**: Mobile-first approach

### 4. File Naming
- **PascalCase**: Components (`Button.tsx`, `Card.tsx`)
- **camelCase**: Hooks (`useAuth.ts`, `useSidebar.ts`)
- **kebab-case**: Files and folders (`code-structure.md`)

### 5. Import Organization
```typescript
// 1. React & Next.js
import { useState } from "react"
import { useRouter } from "next/navigation"

// 2. Third-party libraries
import { motion } from "framer-motion"

// 3. Internal components
import { Button } from "@/components/ui/Button"

// 4. Hooks and services
import { useAuth } from "@/hooks/useAuth"
import { authService } from "@/services/auth"
```

## 🚀 Performance Considerations

### 1. Code Splitting
- Lazy loading for heavy components
- Route-based code splitting
- Dynamic imports for large libraries

### 2. Bundle Optimization
- Tree shaking for unused code
- Image optimization
- Font optimization

### 3. Animation Performance
- Use CSS transforms instead of layout properties
- Debounce expensive operations
- Optimize re-renders with proper dependencies

## 🔄 Development Workflow

### 1. Adding New Components
1. Determine if it's reusable (`/ui`) or feature-specific (`/features`)
2. Create component with proper TypeScript interfaces
3. Add co-located styles if needed
4. Create custom hooks for complex logic
5. Add to component index if needed

### 2. Adding New Features
1. Create feature folder under `/features`
2. Add components, hooks, and types
3. Update routing if needed
4. Add tests and documentation

### 3. Style Updates
1. Check if style exists in `theme.css`
2. Add new CSS variables if needed
3. Update component-specific styles
4. Test responsive behavior

## 📋 Code Quality

### 1. TypeScript
- Strict mode enabled
- Proper type definitions
- Interface for all props
- Generic types where appropriate

### 2. Linting & Formatting
- ESLint for code quality
- Prettier for consistent formatting
- Pre-commit hooks for automation

### 3. Testing
- Unit tests for utilities and hooks
- Integration tests for components
- E2E tests for critical user flows

## 🎨 Design System

### 1. Color Palette
- Primary: `#5f6ad8` (purple-blue)
- Background: `#edeffa` (light blue)
- Text: `#0f172a` (dark slate)
- Consistent with login page theme

### 2. Typography
- Font: Inter (system fallback)
- Weights: 400 (normal), 500 (medium), 700 (bold)
- Sizes: Responsive scale

### 3. Spacing
- Scale: 4px base unit
- Consistent margins and padding
- Responsive adjustments

### 4. Components
- Consistent border radius (1.25rem default)
- Smooth transitions (300ms default)
- Hover and focus states
- Loading states

This structure ensures maintainability, scalability, and consistency across the entire application.
