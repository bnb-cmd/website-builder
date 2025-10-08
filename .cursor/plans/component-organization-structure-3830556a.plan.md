<!-- 3830556a-107a-47d8-b59c-f0d3baca051e 4f0433c3-8978-4802-b6d4-000a7e90eb09 -->
# Component Organization Restructure

## Current Structure Issues

- All components mixed in flat directories
- No separation between editor UI and website content components
- ComponentPalette hardcodes all component definitions
- EditorCanvas has massive switch statement for rendering
- Difficult to add new components without modifying multiple files

## New Structure

```
src/
├── components/
│   ├── editor/                    # Editor UI components (existing)
│   │   ├── ComponentPalette.tsx
│   │   ├── EditorCanvas.tsx
│   │   └── PropertiesPanel.tsx
│   │
│   ├── website/                   # NEW: Renderable website components
│   │   ├── registry.ts            # Component registry & metadata
│   │   ├── renderer.tsx           # Universal component renderer
│   │   │
│   │   ├── basic/                 # Basic components
│   │   │   ├── index.ts
│   │   │   ├── Heading.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Image.tsx
│   │   │   └── Divider.tsx
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── index.ts
│   │   │   ├── Container.tsx
│   │   │   ├── Columns.tsx
│   │   │   └── HeroSection.tsx
│   │   │
│   │   ├── content/               # Content components
│   │   │   ├── index.ts
│   │   │   ├── Gallery.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── List.tsx
│   │   │
│   │   ├── business/              # Business components
│   │   │   ├── index.ts
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Map.tsx
│   │   │   ├── Phone.tsx
│   │   │   └── Email.tsx
│   │   │
│   │   ├── ecommerce/             # E-commerce components
│   │   │   ├── index.ts
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ShoppingCart.tsx
│   │   │   └── PricingCard.tsx
│   │   │
│   │   └── media/                 # Media components
│   │       ├── index.ts
│   │       ├── Video.tsx
│   │       └── Calendar.tsx
│   │
│   ├── ui/                        # Existing UI library
│   ├── layout/                    # Existing layout
│   ├── billing/                   # Existing billing
│   └── figma/                     # Existing figma
│
└── lib/
    └── component-config.ts        # Component configuration types
```

## Implementation Steps

### 1. Create Component Registry System

**File: `src/lib/component-config.ts`**

```typescript
export interface ComponentConfig {
  id: string
  name: string
  category: string
  icon: string
  isPremium?: boolean
  description: string
  defaultProps: Record<string, any>
  defaultSize: { width: number; height: number }
  editableFields: string[]
}

export type ComponentCategory = 
  | 'basic' 
  | 'layout' 
  | 'content' 
  | 'business' 
  | 'ecommerce' 
  | 'media'
```

**File: `src/components/website/registry.ts`**

- Central registry mapping component IDs to their React components
- Export metadata for ComponentPalette
- Export default props and sizes for EditorCanvas
- Type-safe component lookup

### 2. Create Component Renderer

**File: `src/components/website/renderer.tsx`**

- Universal component renderer that replaces EditorCanvas switch statement
- Props: componentType, props, deviceMode, isEditing
- Handles responsive scaling logic
- Cleaner separation of concerns

### 3. Extract Website Components

Create individual component files in category folders:

- Each component is self-contained with its own rendering logic
- Export component + metadata
- Support both editor and published website modes

**Example: `src/components/website/basic/Heading.tsx`**

```typescript
import { ComponentConfig } from '@/lib/component-config'

export const HeadingConfig: ComponentConfig = {
  id: 'heading',
  name: 'Heading',
  category: 'basic',
  icon: 'Type',
  description: 'Add titles and headings',
  defaultProps: { text: 'Your Heading Here', level: 2 },
  defaultSize: { width: 300, height: 60 },
  editableFields: ['text', 'level']
}

export const Heading: React.FC<Props> = ({ text, level, deviceMode, isEditing }) => {
  // Component implementation
}
```

### 4. Update ComponentPalette

- Import from registry instead of hardcoded array
- Automatically organize by category
- Easy to add new components by just adding to registry

### 5. Update EditorCanvas

- Replace massive switch statement with renderer
- Import from registry for default props/sizes
- Much cleaner and more maintainable

### 6. Create Category Index Files

Each category folder gets an `index.ts`:

```typescript
export * from './Heading'
export * from './Text'
export * from './Button'
// etc.
```

## Benefits

1. **Scalability**: Easy to add 100+ components without bloating files
2. **Separation**: Clear distinction between editor UI and website content
3. **Maintainability**: Each component is self-contained
4. **Type Safety**: Strong typing through registry
5. **Reusability**: Components work in editor and published sites
6. **Organization**: Logical categorization by purpose
7. **DRY**: No more duplicate code in ComponentPalette and EditorCanvas
8. **Testability**: Each component can be tested independently

## Migration Strategy

1. Create new structure alongside existing code
2. Move components one category at a time
3. Update imports incrementally
4. Remove old code once verified
5. No breaking changes to existing functionality