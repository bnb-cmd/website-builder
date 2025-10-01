# 📦 Component Registry & Migration Guide

This document tracks all new components, their locations, and how to use them.

---

## 🆕 NEW COMPONENTS (Ready to Use)

### 1. **StatCard** - Animated Statistics Cards
**Location:** `/src/components/dashboard/stat-card.tsx`  
**Status:** ✅ Active  
**Used In:** `/src/app/dashboard/page.tsx`

```tsx
import { StatCard, StatCardGrid } from '@/components/dashboard/stat-card'
import { Globe } from 'lucide-react'

<StatCardGrid>
  <StatCard
    title="Total Websites"
    value="1,234"
    change={12.5}
    changeLabel="vs last month"
    icon={Globe}
    trend="up"
    color="blue"
  />
</StatCardGrid>
```

**Props:**
- `title: string` - Card title
- `value: string | number` - Main value to display
- `change?: number` - Percentage change
- `changeLabel?: string` - Label for change (e.g., "vs last month")
- `icon: LucideIcon` - Icon component
- `trend?: 'up' | 'down' | 'neutral'` - Trend direction
- `color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'` - Color variant
- `loading?: boolean` - Show loading skeleton

---

### 2. **EmptyState** - Empty State Component
**Location:** `/src/components/ui/empty-state.tsx`  
**Status:** ✅ Active  
**Used In:** Ready to use anywhere

```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { FileText } from 'lucide-react'

<EmptyState
  icon={FileText}
  title="No websites yet"
  description="Create your first website to get started"
  action={{
    label: "Create Website",
    onClick: () => router.push('/create'),
    icon: Plus
  }}
  secondaryAction={{
    label: "Browse Templates",
    onClick: () => router.push('/templates')
  }}
/>
```

**Presets:**
- `<NoDataEmptyState onAction={handleCreate} />`
- `<NoResultsEmptyState onReset={handleReset} />`

---

### 3. **EnhancedButton** - Button with States
**Location:** `/src/components/ui/enhanced-button.tsx`  
**Status:** ✅ Active  
**Used In:** Ready to use anywhere

```tsx
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Save } from 'lucide-react'

<EnhancedButton
  loading={isLoading}
  success={isSuccess}
  error={isError}
  icon={Save}
  iconPosition="left"
  onClick={handleSave}
>
  Save Changes
</EnhancedButton>
```

---

### 4. **ToastNotification** - Toast System
**Location:** `/src/components/ui/toast-notification.tsx`  
**Status:** ✅ Active  
**Setup Required:** Wrap app with ToastProvider

```tsx
// In root layout or _app.tsx
import { ToastProvider } from '@/components/ui/toast-notification'

<ToastProvider>
  <YourApp />
</ToastProvider>

// In any component
import { useToast } from '@/components/ui/toast-notification'

const { success, error, info, warning } = useToast()

success('Saved!', 'Your changes have been saved')
error('Error', 'Something went wrong')
info('Info', 'This is an information message')
warning('Warning', 'Please check your input')
```

---

### 5. **FloatingInput** - Floating Label Inputs
**Location:** `/src/components/ui/floating-input.tsx`  
**Status:** ✅ Active  
**Used In:** Ready to use in forms

```tsx
import { FloatingInput, FloatingTextarea } from '@/components/ui/floating-input'
import { Mail, Lock } from 'lucide-react'

<FloatingInput
  label="Email Address"
  type="email"
  icon={Mail}
  iconPosition="left"
  error={errors.email}
  helperText="We'll never share your email"
  size="md"
/>

<FloatingTextarea
  label="Description"
  rows={4}
  error={errors.description}
/>
```

---

### 6. **SkeletonLoader** - Loading Skeletons
**Location:** `/src/components/ui/skeleton-loader.tsx`  
**Status:** ✅ Active  
**Used In:** `/src/app/dashboard/page.tsx`

```tsx
import { 
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonForm,
  SkeletonDashboard,
  SkeletonAvatar,
  SkeletonText
} from '@/components/ui/skeleton-loader'

// Basic skeleton
<Skeleton className="h-4 w-32" variant="text" animation="pulse" />

// Preset skeletons
{loading ? <SkeletonDashboard /> : <Dashboard />}
{loading ? <SkeletonTable rows={5} /> : <Table />}
{loading ? <SkeletonList items={3} /> : <List />}
```

---

### 7. **ZoomControls** - Canvas Zoom Controls
**Location:** `/src/components/editor/zoom-controls.tsx`  
**Status:** ✅ Active  
**Used In:** `/src/components/editor/canvas.tsx`

```tsx
import { ZoomControls } from '@/components/editor/zoom-controls'

<ZoomControls 
  onZoomChange={(zoom) => console.log('Zoom:', zoom)}
/>
```

---

### 8. **TooltipWrapper** - Enhanced Tooltips
**Location:** `/src/components/editor/tooltip-wrapper.tsx`  
**Status:** ✅ Active  
**Used In:** `/src/components/editor/website-editor.tsx`

```tsx
import { TooltipWrapper } from '@/components/editor/tooltip-wrapper'
import { Save } from 'lucide-react'

<TooltipWrapper content="Save Changes" shortcut="⌘S" side="bottom">
  <Button onClick={handleSave}>
    <Save className="h-4 w-4" />
  </Button>
</TooltipWrapper>
```

---

## 🔄 REPLACED COMPONENTS

### Old Dashboard Stats Cards → New StatCard
**Old:** Plain `<Card>` components in dashboard  
**New:** `<StatCard>` component  
**Migration:** Already done in `/src/app/dashboard/page.tsx`

**Before:**
```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm">Total Websites</p>
        <p className="text-3xl">{count}</p>
      </div>
      <Globe className="h-6 w-6" />
    </div>
  </CardContent>
</Card>
```

**After:**
```tsx
<StatCard
  title="Total Websites"
  value={count}
  change={12.5}
  icon={Globe}
  trend="up"
  color="blue"
/>
```

---

### Old Loading States → New SkeletonLoader
**Old:** `<SmartSkeleton>` or custom loading divs  
**New:** `<SkeletonDashboard>` and variants  
**Migration:** Already done in `/src/app/dashboard/page.tsx`

**Before:**
```tsx
{loading && <SmartSkeleton type="dashboard" />}
```

**After:**
```tsx
{loading && <SkeletonDashboard />}
```

---

## 📁 FILE STATUS

### ✅ Active Files (Use These)
- `/src/app/dashboard/page.tsx` - ✅ Enhanced dashboard
- `/src/components/dashboard/stat-card.tsx` - ✅ New component
- `/src/components/ui/empty-state.tsx` - ✅ New component
- `/src/components/ui/enhanced-button.tsx` - ✅ New component
- `/src/components/ui/toast-notification.tsx` - ✅ New component
- `/src/components/ui/floating-input.tsx` - ✅ New component
- `/src/components/ui/skeleton-loader.tsx` - ✅ New component
- `/src/components/editor/zoom-controls.tsx` - ✅ New component
- `/src/components/editor/tooltip-wrapper.tsx` - ✅ New component

### ⚠️ Deprecated Files (Don't Use)
- `/src/app/dashboard/page-backup.tsx` - ⚠️ Old broken version (kept for reference)

### 🔧 Enhanced Files (Updated)
- `/src/components/editor/canvas.tsx` - ✅ Enhanced with grid background
- `/src/components/editor/sidebar.tsx` - ✅ Enhanced with glass effect
- `/src/components/editor/properties-panel.tsx` - ✅ Enhanced with backdrop blur
- `/src/components/editor/toolbar.tsx` - ✅ Enhanced with gradients
- `/src/components/editor/website-editor.tsx` - ✅ Enhanced with tooltips
- `/src/components/dashboard/dashboard-layout.tsx` - ✅ Enhanced sidebar
- `/src/components/layout/header.tsx` - ✅ Enhanced with search
- `/src/components/home/hero.tsx` - ✅ Enhanced with animations
- `/src/app/globals.css` - ✅ Added animations

---

## 🔗 COMPONENT DEPENDENCIES

### StatCard
- **Depends on:** `lucide-react`, `@/lib/utils`
- **Used by:** Dashboard page
- **No breaking changes**

### EmptyState
- **Depends on:** `lucide-react`, `@/components/ui/button`
- **Used by:** Ready to use anywhere
- **No breaking changes**

### ToastNotification
- **Depends on:** `lucide-react`, React Context
- **Requires:** `<ToastProvider>` wrapper in root
- **Setup needed:** Yes (wrap app)

### FloatingInput
- **Depends on:** `lucide-react`, `@/lib/utils`
- **Used by:** Ready to use in forms
- **No breaking changes**

### SkeletonLoader
- **Depends on:** `@/lib/utils`
- **Used by:** Dashboard page
- **No breaking changes**

---

## 🚀 QUICK MIGRATION CHECKLIST

### For Dashboard Pages:
- [x] Replace plain Card stats with StatCard ✅ Done
- [x] Replace loading states with SkeletonDashboard ✅ Done
- [ ] Add ToastProvider if using notifications
- [ ] Replace form inputs with FloatingInput (optional)
- [ ] Add EmptyState for empty data (optional)

### For Editor Pages:
- [x] Canvas has zoom controls ✅ Done
- [x] Tooltips added to toolbar ✅ Done
- [ ] Add ToastProvider for save notifications
- [ ] Use EnhancedButton for save buttons (optional)

### For Forms:
- [ ] Replace Input with FloatingInput (optional)
- [ ] Add validation error states
- [ ] Use EnhancedButton for submit buttons

---

## 📞 SUPPORT

### Component Not Working?
1. Check imports are correct
2. Verify dependencies are installed
3. Check if ToastProvider is needed
4. Look at usage examples above

### Need Help?
- Check `/IMPLEMENTATION_COMPLETE.md` for full documentation
- Look at `/src/app/dashboard/page.tsx` for real-world usage
- All components have TypeScript types for IntelliSense

---

## 🗑️ CLEANUP PLAN

### Files to Delete (After Verification):
1. `/src/app/dashboard/page-backup.tsx` - Can be deleted after confirming new version works
2. Any old custom loading components if replaced by SkeletonLoader

### Files to Keep:
- All new components (they're production-ready)
- All enhanced files (they're improvements, not replacements)

---

**Last Updated:** 2025-10-01  
**Version:** 1.0.0  
**Status:** All components active and production-ready ✅
