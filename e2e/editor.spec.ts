import { test, expect, Page } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123',
  name: 'Test User'
}

const testSite = {
  name: 'Test Website',
  description: 'A test website for automated testing',
  subdomain: 'test-site-' + Date.now()
}

const testComponents = [
  {
    type: 'hero',
    props: {
      title: 'Welcome to Test Site',
      subtitle: 'This is a test hero section',
      buttonText: 'Get Started',
      buttonUrl: '#'
    },
    layout: {
      default: { x: 0, y: 0, width: 100, height: 400, zIndex: 1 }
    },
    styles: {
      default: { backgroundColor: '#f8f9fa', textAlign: 'center' }
    }
  },
  {
    type: 'features',
    props: {
      title: 'Our Features',
      features: [
        { title: 'Feature 1', description: 'Description of feature 1' },
        { title: 'Feature 2', description: 'Description of feature 2' }
      ],
      columns: 2
    },
    layout: {
      default: { x: 0, y: 400, width: 100, height: 300, zIndex: 1 }
    },
    styles: {
      default: { backgroundColor: '#ffffff', padding: '40px' }
    }
  }
]

// Helper functions
async function login(page: Page) {
  await page.goto('/login')
  await page.fill('[data-testid="email-input"]', testUser.email)
  await page.fill('[data-testid="password-input"]', testUser.password)
  await page.click('[data-testid="login-button"]')
  await page.waitForURL('/dashboard')
}

async function createNewSite(page: Page) {
  await page.click('[data-testid="create-site-button"]')
  await page.fill('[data-testid="site-name-input"]', testSite.name)
  await page.fill('[data-testid="site-description-input"]', testSite.description)
  await page.fill('[data-testid="site-subdomain-input"]', testSite.subdomain)
  await page.click('[data-testid="create-site-submit"]')
  await page.waitForURL(/\/editor\/.*/)
}

async function addComponent(page: Page, componentType: string) {
  await page.click('[data-testid="component-palette-toggle"]')
  await page.click(`[data-testid="component-${componentType}"]`)
  await page.waitForSelector(`[data-testid="component-${componentType}-added"]`)
}

async function selectComponent(page: Page, componentId: string) {
  await page.click(`[data-testid="component-${componentId}"]`)
  await page.waitForSelector(`[data-testid="component-${componentId}-selected"]`)
}

async function waitForAutosave(page: Page) {
  await page.waitForSelector('[data-testid="autosave-indicator"]')
  await page.waitForSelector('[data-testid="autosave-indicator"]', { state: 'hidden' })
}

// Test suite
test.describe('Website Builder Editor', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await createNewSite(page)
  })

  test.describe('Drag & Drop', () => {
    test('should add component from palette to canvas', async ({ page }) => {
      // Add hero component
      await addComponent(page, 'hero')
      
      // Verify component is added to canvas
      await expect(page.locator('[data-testid="canvas"]')).toContainText('Welcome to Test Site')
      
      // Verify component appears in layers panel
      await expect(page.locator('[data-testid="layers-panel"]')).toContainText('hero')
    })

    test('should move component on canvas', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Get initial position
      const component = page.locator('[data-testid="component-hero"]')
      const initialPosition = await component.boundingBox()
      
      // Drag component
      await component.dragTo(page.locator('[data-testid="canvas"]'), {
        targetPosition: { x: 100, y: 100 }
      })
      
      // Verify position changed
      const newPosition = await component.boundingBox()
      expect(newPosition?.x).not.toBe(initialPosition?.x)
      expect(newPosition?.y).not.toBe(initialPosition?.y)
    })

    test('should resize component', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Select component
      await selectComponent(page, 'hero')
      
      // Resize using resize handle
      const resizeHandle = page.locator('[data-testid="resize-handle-se"]')
      await resizeHandle.dragTo(resizeHandle, {
        targetPosition: { x: 50, y: 50 }
      })
      
      // Verify size changed
      const component = page.locator('[data-testid="component-hero"]')
      const boundingBox = await component.boundingBox()
      expect(boundingBox?.width).toBeGreaterThan(100)
      expect(boundingBox?.height).toBeGreaterThan(100)
    })

    test('should show alignment guides when dragging', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Drag second component near first
      const secondComponent = page.locator('[data-testid="component-features"]')
      await secondComponent.dragTo(page.locator('[data-testid="component-hero"]'))
      
      // Verify alignment guides appear
      await expect(page.locator('[data-testid="alignment-guide"]')).toBeVisible()
    })

    test('should snap to grid when enabled', async ({ page }) => {
      // Enable snap to grid
      await page.click('[data-testid="snap-grid-toggle"]')
      
      await addComponent(page, 'hero')
      
      // Drag component
      const component = page.locator('[data-testid="component-hero"]')
      await component.dragTo(page.locator('[data-testid="canvas"]'), {
        targetPosition: { x: 123, y: 456 } // Non-grid positions
      })
      
      // Verify component snapped to grid
      const position = await component.boundingBox()
      expect(position?.x).toBe(120) // Snapped to grid
      expect(position?.y).toBe(460) // Snapped to grid
    })
  })

  test.describe('Undo/Redo', () => {
    test('should undo component addition', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Verify component exists
      await expect(page.locator('[data-testid="component-hero"]')).toBeVisible()
      
      // Undo
      await page.keyboard.press('Control+z')
      
      // Verify component removed
      await expect(page.locator('[data-testid="component-hero"]')).not.toBeVisible()
    })

    test('should redo component addition', async ({ page }) => {
      await addComponent(page, 'hero')
      await page.keyboard.press('Control+z') // Undo
      
      // Verify component removed
      await expect(page.locator('[data-testid="component-hero"]')).not.toBeVisible()
      
      // Redo
      await page.keyboard.press('Control+Shift+z')
      
      // Verify component restored
      await expect(page.locator('[data-testid="component-hero"]')).toBeVisible()
    })

    test('should undo component movement', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Move component
      const component = page.locator('[data-testid="component-hero"]')
      const initialPosition = await component.boundingBox()
      
      await component.dragTo(page.locator('[data-testid="canvas"]'), {
        targetPosition: { x: 100, y: 100 }
      })
      
      // Verify position changed
      const newPosition = await component.boundingBox()
      expect(newPosition?.x).not.toBe(initialPosition?.x)
      
      // Undo
      await page.keyboard.press('Control+z')
      
      // Verify position restored
      const restoredPosition = await component.boundingBox()
      expect(restoredPosition?.x).toBe(initialPosition?.x)
    })

    test('should show undo/redo buttons state correctly', async ({ page }) => {
      // Initially both buttons should be disabled
      await expect(page.locator('[data-testid="undo-button"]')).toBeDisabled()
      await expect(page.locator('[data-testid="redo-button"]')).toBeDisabled()
      
      // Add component
      await addComponent(page, 'hero')
      
      // Undo button should be enabled, redo disabled
      await expect(page.locator('[data-testid="undo-button"]')).toBeEnabled()
      await expect(page.locator('[data-testid="redo-button"]')).toBeDisabled()
      
      // Undo
      await page.click('[data-testid="undo-button"]')
      
      // Redo button should be enabled, undo disabled
      await expect(page.locator('[data-testid="redo-button"]')).toBeEnabled()
      await expect(page.locator('[data-testid="undo-button"]')).toBeDisabled()
    })
  })

  test.describe('Autosave', () => {
    test('should autosave after component changes', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Wait for autosave
      await waitForAutosave(page)
      
      // Verify autosave indicator appeared
      await expect(page.locator('[data-testid="autosave-indicator"]')).toBeVisible()
    })

    test('should autosave after component property changes', async ({ page }) => {
      await addComponent(page, 'hero')
      await selectComponent(page, 'hero')
      
      // Change component property
      await page.fill('[data-testid="component-title-input"]', 'New Title')
      
      // Wait for autosave
      await waitForAutosave(page)
      
      // Verify autosave indicator appeared
      await expect(page.locator('[data-testid="autosave-indicator"]')).toBeVisible()
    })

    test('should show autosave error when failed', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/v1/content/**', route => route.abort())
      
      await addComponent(page, 'hero')
      
      // Wait for autosave attempt
      await page.waitForSelector('[data-testid="autosave-indicator"]')
      
      // Verify error indicator
      await expect(page.locator('[data-testid="autosave-error"]')).toBeVisible()
    })
  })

  test.describe('Responsive Preview', () => {
    test('should switch between device modes', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Test desktop mode
      await page.click('[data-testid="device-desktop"]')
      await expect(page.locator('[data-testid="canvas"]')).toHaveClass(/device-desktop/)
      
      // Test tablet mode
      await page.click('[data-testid="device-tablet"]')
      await expect(page.locator('[data-testid="canvas"]')).toHaveClass(/device-tablet/)
      
      // Test mobile mode
      await page.click('[data-testid="device-mobile"]')
      await expect(page.locator('[data-testid="canvas"]')).toHaveClass(/device-mobile/)
    })

    test('should apply responsive styles', async ({ page }) => {
      await addComponent(page, 'hero')
      await selectComponent(page, 'hero')
      
      // Set different styles for tablet
      await page.click('[data-testid="device-tablet"]')
      await page.fill('[data-testid="component-font-size-input"]', '14')
      
      // Switch to mobile
      await page.click('[data-testid="device-mobile"]')
      await page.fill('[data-testid="component-font-size-input"]', '12')
      
      // Switch back to desktop
      await page.click('[data-testid="device-desktop"]')
      
      // Verify styles are preserved
      const component = page.locator('[data-testid="component-hero"]')
      await expect(component).toHaveCSS('font-size', '16px')
    })

    test('should show breakpoint overrides', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Set tablet override
      await page.click('[data-testid="device-tablet"]')
      await selectComponent(page, 'hero')
      await page.fill('[data-testid="component-padding-input"]', '20')
      
      // Verify override badge appears
      await expect(page.locator('[data-testid="breakpoint-override-badge"]')).toBeVisible()
    })
  })

  test.describe('Component Operations', () => {
    test('should duplicate component', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Select component
      await selectComponent(page, 'hero')
      
      // Duplicate
      await page.click('[data-testid="duplicate-component-button"]')
      
      // Verify two components exist
      await expect(page.locator('[data-testid="component-hero"]')).toHaveCount(2)
    })

    test('should delete component', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Select component
      await selectComponent(page, 'hero')
      
      // Delete
      await page.click('[data-testid="delete-component-button"]')
      
      // Confirm deletion
      await page.click('[data-testid="confirm-delete-button"]')
      
      // Verify component removed
      await expect(page.locator('[data-testid="component-hero"]')).not.toBeVisible()
    })

    test('should toggle component visibility', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Select component
      await selectComponent(page, 'hero')
      
      // Toggle visibility
      await page.click('[data-testid="toggle-visibility-button"]')
      
      // Verify component hidden
      await expect(page.locator('[data-testid="component-hero"]')).toHaveClass(/hidden/)
      
      // Toggle back
      await page.click('[data-testid="toggle-visibility-button"]')
      
      // Verify component visible
      await expect(page.locator('[data-testid="component-hero"]')).not.toHaveClass(/hidden/)
    })

    test('should toggle component lock', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Select component
      await selectComponent(page, 'hero')
      
      // Toggle lock
      await page.click('[data-testid="toggle-lock-button"]')
      
      // Verify component locked
      await expect(page.locator('[data-testid="component-hero"]')).toHaveClass(/locked/)
      
      // Try to move locked component
      const component = page.locator('[data-testid="component-hero"]')
      const initialPosition = await component.boundingBox()
      
      await component.dragTo(page.locator('[data-testid="canvas"]'), {
        targetPosition: { x: 100, y: 100 }
      })
      
      // Verify position didn't change
      const newPosition = await component.boundingBox()
      expect(newPosition?.x).toBe(initialPosition?.x)
    })
  })

  test.describe('Layers Panel', () => {
    test('should show components in layers panel', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Verify components appear in layers panel
      await expect(page.locator('[data-testid="layers-panel"]')).toContainText('hero')
      await expect(page.locator('[data-testid="layers-panel"]')).toContainText('features')
    })

    test('should reorder components in layers panel', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Drag component in layers panel
      const heroLayer = page.locator('[data-testid="layer-hero"]')
      const featuresLayer = page.locator('[data-testid="layer-features"]')
      
      await heroLayer.dragTo(featuresLayer)
      
      // Verify order changed
      const layers = page.locator('[data-testid="layers-panel"] [data-testid^="layer-"]')
      const firstLayer = await layers.first().textContent()
      expect(firstLayer).toContain('features')
    })

    test('should search components in layers panel', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Search for hero
      await page.fill('[data-testid="layers-search-input"]', 'hero')
      
      // Verify only hero is visible
      await expect(page.locator('[data-testid="layer-hero"]')).toBeVisible()
      await expect(page.locator('[data-testid="layer-features"]')).not.toBeVisible()
    })

    test('should filter components by visibility', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Hide hero component
      await selectComponent(page, 'hero')
      await page.click('[data-testid="toggle-visibility-button"]')
      
      // Filter by visible
      await page.click('[data-testid="filter-visible-button"]')
      
      // Verify only visible components shown
      await expect(page.locator('[data-testid="layer-hero"]')).not.toBeVisible()
      await expect(page.locator('[data-testid="layer-features"]')).toBeVisible()
    })
  })

  test.describe('Component Grouping', () => {
    test('should group multiple components', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Select both components
      await page.keyboard.down('Shift')
      await selectComponent(page, 'hero')
      await selectComponent(page, 'features')
      await page.keyboard.up('Shift')
      
      // Create group
      await page.click('[data-testid="group-components-button"]')
      await page.fill('[data-testid="group-name-input"]', 'Header Group')
      await page.click('[data-testid="create-group-button"]')
      
      // Verify group created
      await expect(page.locator('[data-testid="group-header-group"]')).toBeVisible()
    })

    test('should ungroup components', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Group components
      await page.keyboard.down('Shift')
      await selectComponent(page, 'hero')
      await selectComponent(page, 'features')
      await page.keyboard.up('Shift')
      
      await page.click('[data-testid="group-components-button"]')
      await page.fill('[data-testid="group-name-input"]', 'Header Group')
      await page.click('[data-testid="create-group-button"]')
      
      // Select group
      await page.click('[data-testid="group-header-group"]')
      
      // Ungroup
      await page.click('[data-testid="ungroup-components-button"]')
      
      // Verify group removed
      await expect(page.locator('[data-testid="group-header-group"]')).not.toBeVisible()
    })

    test('should move group as unit', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Group components
      await page.keyboard.down('Shift')
      await selectComponent(page, 'hero')
      await selectComponent(page, 'features')
      await page.keyboard.up('Shift')
      
      await page.click('[data-testid="group-components-button"]')
      await page.fill('[data-testid="group-name-input"]', 'Header Group')
      await page.click('[data-testid="create-group-button"]')
      
      // Get initial positions
      const heroComponent = page.locator('[data-testid="component-hero"]')
      const featuresComponent = page.locator('[data-testid="component-features"]')
      const heroInitialPosition = await heroComponent.boundingBox()
      const featuresInitialPosition = await featuresComponent.boundingBox()
      
      // Move group
      await page.click('[data-testid="group-header-group"]')
      await page.dragAndDrop('[data-testid="group-header-group"]', '[data-testid="canvas"]', {
        targetPosition: { x: 100, y: 100 }
      })
      
      // Verify both components moved
      const heroNewPosition = await heroComponent.boundingBox()
      const featuresNewPosition = await featuresComponent.boundingBox()
      
      expect(heroNewPosition?.x).not.toBe(heroInitialPosition?.x)
      expect(featuresNewPosition?.x).not.toBe(featuresInitialPosition?.x)
    })
  })

  test.describe('RTL Support', () => {
    test('should switch to RTL mode', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Switch to Urdu/RTL
      await page.click('[data-testid="language-selector"]')
      await page.click('[data-testid="language-urdu"]')
      
      // Verify RTL mode enabled
      await expect(page.locator('[data-testid="canvas"]')).toHaveAttribute('dir', 'rtl')
    })

    test('should mirror layouts in RTL mode', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Switch to RTL
      await page.click('[data-testid="language-selector"]')
      await page.click('[data-testid="language-urdu"]')
      
      // Verify text alignment mirrored
      const component = page.locator('[data-testid="component-hero"]')
      await expect(component).toHaveCSS('text-align', 'right')
    })

    test('should auto-detect Urdu text', async ({ page }) => {
      await addComponent(page, 'hero')
      await selectComponent(page, 'hero')
      
      // Enter Urdu text
      await page.fill('[data-testid="component-title-input"]', 'آپ کا خوش آمدید')
      
      // Auto-detect language
      await page.click('[data-testid="auto-detect-language-button"]')
      
      // Verify language switched to Urdu
      await expect(page.locator('[data-testid="language-selector"]')).toContainText('اردو')
    })
  })

  test.describe('Save as Template', () => {
    test('should save current design as template', async ({ page }) => {
      await addComponent(page, 'hero')
      await addComponent(page, 'features')
      
      // Open save template dialog
      await page.click('[data-testid="save-template-button"]')
      
      // Fill template details
      await page.fill('[data-testid="template-name-input"]', 'Test Template')
      await page.fill('[data-testid="template-description-input"]', 'A test template')
      await page.click('[data-testid="template-category-business"]')
      
      // Save template
      await page.click('[data-testid="save-template-submit"]')
      
      // Verify success message
      await expect(page.locator('[data-testid="template-saved-success"]')).toBeVisible()
    })
  })

  test.describe('Publishing', () => {
    test('should publish site', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Publish site
      await page.click('[data-testid="publish-button"]')
      
      // Wait for publish job to start
      await page.waitForSelector('[data-testid="publish-job-started"]')
      
      // Verify publish job status
      await expect(page.locator('[data-testid="publish-status"]')).toContainText('Processing')
      
      // Wait for completion
      await page.waitForSelector('[data-testid="publish-completed"]', { timeout: 30000 })
      
      // Verify deployment URL
      await expect(page.locator('[data-testid="deployment-url"]')).toBeVisible()
    })

    test('should show publish progress', async ({ page }) => {
      await addComponent(page, 'hero')
      
      // Start publish
      await page.click('[data-testid="publish-button"]')
      
      // Verify progress bar
      await expect(page.locator('[data-testid="publish-progress"]')).toBeVisible()
      
      // Verify progress updates
      await page.waitForSelector('[data-testid="publish-progress"]', { state: 'visible' })
    })

    test('should handle publish errors', async ({ page }) => {
      // Mock publish failure
      await page.route('**/api/v1/publish/**', route => route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: { message: 'Publish failed' } })
      }))
      
      await addComponent(page, 'hero')
      
      // Try to publish
      await page.click('[data-testid="publish-button"]')
      
      // Verify error message
      await expect(page.locator('[data-testid="publish-error"]')).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should load editor quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/editor')
      
      // Wait for editor to be ready
      await page.waitForSelector('[data-testid="editor-ready"]')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    test('should handle large number of components', async ({ page }) => {
      // Add many components
      for (let i = 0; i < 20; i++) {
        await addComponent(page, 'hero')
      }
      
      // Verify all components rendered
      await expect(page.locator('[data-testid="component-hero"]')).toHaveCount(20)
      
      // Verify editor still responsive
      await page.click('[data-testid="component-hero"]')
      await expect(page.locator('[data-testid="component-properties"]')).toBeVisible()
    })
  })
})
