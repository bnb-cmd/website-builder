import { test, expect } from '@playwright/test'

test.describe('Website Builder E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Pakistan Website Builder/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should allow user registration', async ({ page }) => {
    await page.click('text=Sign Up')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test('should allow user login', async ({ page }) => {
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should create a new website', async ({ page }) => {
    // Login first
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Create new website
    await page.click('text=Create Website')
    await page.fill('input[name="title"]', 'My Test Website')
    await page.selectOption('select[name="template"]', 'business')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Website Editor')).toBeVisible()
  })

  test('should edit website elements', async ({ page }) => {
    // Login and navigate to editor
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Edit Website')
    
    // Add text element
    await page.dragAndDrop('[data-testid="text-element"]', '[data-testid="canvas"]')
    await page.fill('[data-testid="text-content"]', 'Hello World!')
    
    // Add image element
    await page.dragAndDrop('[data-testid="image-element"]', '[data-testid="canvas"]')
    await page.setInputFiles('input[type="file"]', 'test-image.jpg')
    
    // Save website
    await page.click('button[data-testid="save-button"]')
    await expect(page.locator('text=Website saved successfully')).toBeVisible()
  })

  test('should preview website', async ({ page }) => {
    // Login and navigate to editor
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Edit Website')
    await page.click('button[data-testid="preview-button"]')
    
    // Check if preview opens in new tab
    const newPage = await page.waitForEvent('popup')
    await expect(newPage.locator('body')).toBeVisible()
  })

  test('should publish website', async ({ page }) => {
    // Login and navigate to editor
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Edit Website')
    await page.click('button[data-testid="publish-button"]')
    
    // Fill in domain details
    await page.fill('input[name="domain"]', 'mywebsite')
    await page.selectOption('select[name="extension"]', '.pk')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Website published successfully')).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Login and navigate to editor
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Edit Website')
    
    // Test mobile view
    await page.click('button[data-testid="mobile-view"]')
    await expect(page.locator('[data-testid="canvas"]')).toHaveClass(/mobile/)
    
    // Test tablet view
    await page.click('button[data-testid="tablet-view"]')
    await expect(page.locator('[data-testid="canvas"]')).toHaveClass(/tablet/)
    
    // Test desktop view
    await page.click('button[data-testid="desktop-view"]')
    await expect(page.locator('[data-testid="canvas"]')).toHaveClass(/desktop/)
  })

  test('should handle AI features', async ({ page }) => {
    // Login and navigate to editor
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Edit Website')
    
    // Open AI assistant
    await page.click('button[data-testid="ai-assistant"]')
    await expect(page.locator('text=AI Assistant')).toBeVisible()
    
    // Generate content
    await page.fill('textarea[placeholder="Describe your website"]', 'A modern business website')
    await page.click('button[data-testid="generate-content"]')
    await expect(page.locator('text=Content generated')).toBeVisible()
  })

  test('should handle payment processing', async ({ page }) => {
    // Login and navigate to billing
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Billing')
    await page.click('text=Upgrade Plan')
    
    // Select plan
    await page.click('button[data-testid="pro-plan"]')
    
    // Fill payment details (using test card)
    await page.fill('input[name="cardNumber"]', '4242424242424242')
    await page.fill('input[name="expiry"]', '12/25')
    await page.fill('input[name="cvc"]', '123')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Payment successful')).toBeVisible()
  })

  test('should have collapsible sidebar', async ({ page }) => {
    // Login and navigate to dashboard
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Check if sidebar is visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    
    // Click collapse button
    await page.click('button[data-testid="sidebar-collapse"]')
    
    // Check if sidebar is collapsed
    await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-16/)
    
    // Click expand button
    await page.click('button[data-testid="sidebar-collapse"]')
    
    // Check if sidebar is expanded
    await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-64/)
  })

  test('should auto-collapse sidebar when editor opens', async ({ page }) => {
    // Login and navigate to dashboard
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Ensure sidebar is expanded
    await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-64/)
    
    // Navigate to editor
    await page.click('text=Create Website')
    
    // Check if sidebar is auto-collapsed
    await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-16/)
  })
})
