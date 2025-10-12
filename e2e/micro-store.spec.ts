import { test, expect } from '@playwright/test'

test.describe('Micro-Store E-commerce Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the website builder
    await page.goto('/')
    
    // Login as a STARTER package user
    await page.click('[data-testid="login-button"]')
    await page.fill('[data-testid="email-input"]', 'starter@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-submit"]')
    
    // Wait for dashboard to load
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()
  })

  test('should create a micro-store website', async ({ page }) => {
    // Click "Create New Website"
    await page.click('[data-testid="create-website-button"]')
    
    // Select Micro-Store template
    await page.click('[data-testid="template-micro-store"]')
    
    // Fill website details
    await page.fill('[data-testid="website-name"]', 'My Handmade Jewelry Store')
    await page.fill('[data-testid="website-description"]', 'Beautiful handmade jewelry for every occasion')
    
    // Set language to Urdu
    await page.selectOption('[data-testid="language-select"]', 'URDU')
    
    // Click "Create Website"
    await page.click('[data-testid="create-website-submit"]')
    
    // Wait for editor to load
    await expect(page.locator('[data-testid="editor-canvas"]')).toBeVisible()
    
    // Verify template components are loaded
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="products-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="shopping-cart"]')).toBeVisible()
  })

  test('should add products to the store', async ({ page }) => {
    // Navigate to product management
    await page.click('[data-testid="products-tab"]')
    
    // Click "Add Product"
    await page.click('[data-testid="add-product-button"]')
    
    // Fill product details
    await page.fill('[data-testid="product-name"]', 'Silver Necklace')
    await page.fill('[data-testid="product-description"]', 'Beautiful handcrafted silver necklace')
    await page.fill('[data-testid="product-price"]', '2500')
    await page.fill('[data-testid="product-image-url"]', 'https://example.com/necklace.jpg')
    await page.fill('[data-testid="product-stock"]', '10')
    
    // Save product
    await page.click('[data-testid="save-product"]')
    
    // Verify product appears in list
    await expect(page.locator('[data-testid="product-list"]')).toContainText('Silver Necklace')
    await expect(page.locator('[data-testid="product-list"]')).toContainText('Rs. 2,500')
  })

  test('should import product from social media link', async ({ page }) => {
    // Navigate to product management
    await page.click('[data-testid="products-tab"]')
    
    // Click "Import from Social Media"
    await page.click('[data-testid="import-social-button"]')
    
    // Select platform
    await page.selectOption('[data-testid="platform-select"]', 'instagram')
    
    // Enter Instagram post URL
    await page.fill('[data-testid="social-url"]', 'https://instagram.com/p/abc123')
    
    // Mock the API response
    await page.route('**/api/v1/social/import-link', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            productId: 'imported-product-1',
            name: 'Instagram Product',
            price: 1500,
            currency: 'PKR',
            imageUrl: 'https://example.com/instagram-image.jpg',
            platform: 'instagram',
            originalUrl: 'https://instagram.com/p/abc123'
          }
        })
      })
    })
    
    // Click import
    await page.click('[data-testid="import-submit"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Product imported successfully')
    
    // Verify product appears in list
    await expect(page.locator('[data-testid="product-list"]')).toContainText('Instagram Product')
  })

  test('should display products on the website', async ({ page }) => {
    // Add a product first
    await page.click('[data-testid="products-tab"]')
    await page.click('[data-testid="add-product-button"]')
    await page.fill('[data-testid="product-name"]', 'Test Product')
    await page.fill('[data-testid="product-price"]', '1000')
    await page.fill('[data-testid="product-image-url"]', 'https://example.com/test.jpg')
    await page.click('[data-testid="save-product"]')
    
    // Switch to preview mode
    await page.click('[data-testid="preview-button"]')
    
    // Verify product appears in the store
    await expect(page.locator('[data-testid="product-card"]')).toContainText('Test Product')
    await expect(page.locator('[data-testid="product-card"]')).toContainText('Rs. 1,000')
    await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible()
  })

  test('should add products to cart', async ({ page }) => {
    // Add a product first
    await page.click('[data-testid="products-tab"]')
    await page.click('[data-testid="add-product-button"]')
    await page.fill('[data-testid="product-name"]', 'Cart Test Product')
    await page.fill('[data-testid="product-price"]', '1500')
    await page.fill('[data-testid="product-image-url"]', 'https://example.com/cart-test.jpg')
    await page.click('[data-testid="save-product"]')
    
    // Switch to preview mode
    await page.click('[data-testid="preview-button"]')
    
    // Add product to cart
    await page.click('[data-testid="add-to-cart-button"]')
    
    // Verify cart shows the product
    await expect(page.locator('[data-testid="cart-toggle"]')).toContainText('1')
    
    // Open cart
    await page.click('[data-testid="cart-toggle"]')
    
    // Verify cart contents
    await expect(page.locator('[data-testid="cart-item"]')).toContainText('Cart Test Product')
    await expect(page.locator('[data-testid="cart-item"]')).toContainText('Rs. 1,500')
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('Rs. 1,500')
  })

  test('should complete checkout process', async ({ page }) => {
    // Add product and go to preview
    await page.click('[data-testid="products-tab"]')
    await page.click('[data-testid="add-product-button"]')
    await page.fill('[data-testid="product-name"]', 'Checkout Test Product')
    await page.fill('[data-testid="product-price"]', '2000')
    await page.fill('[data-testid="product-image-url"]', 'https://example.com/checkout-test.jpg')
    await page.click('[data-testid="save-product"]')
    
    await page.click('[data-testid="preview-button"]')
    
    // Add to cart and proceed to checkout
    await page.click('[data-testid="add-to-cart-button"]')
    await page.click('[data-testid="cart-toggle"]')
    await page.click('[data-testid="proceed-to-checkout"]')
    
    // Fill checkout form
    await page.fill('[data-testid="customer-name"]', 'Ahmed Ali')
    await page.fill('[data-testid="customer-phone"]', '+92 300 1234567')
    await page.fill('[data-testid="customer-email"]', 'ahmed@example.com')
    
    // Fill shipping address
    await page.fill('[data-testid="address-line1"]', '123 Main Street')
    await page.fill('[data-testid="address-line2"]', 'Apt 4B')
    await page.fill('[data-testid="city"]', 'Karachi')
    await page.fill('[data-testid="postal-code"]', '75000')
    
    // Select payment method
    await page.check('[data-testid="payment-cod"]')
    
    // Add order notes
    await page.fill('[data-testid="order-notes"]', 'Please deliver after 6 PM')
    
    // Mock order creation API
    await page.route('**/api/v1/orders', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orderId: 'order-123',
            totalAmount: 2000,
            currency: 'PKR',
            status: 'pending',
            paymentMethod: 'cod',
            createdAt: new Date().toISOString()
          }
        })
      })
    })
    
    // Place order
    await page.click('[data-testid="place-order"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="order-success"]')).toContainText('Order placed successfully')
    await expect(page.locator('[data-testid="order-id"]')).toContainText('order-123')
  })

  test('should manage orders in admin dashboard', async ({ page }) => {
    // Navigate to orders dashboard
    await page.click('[data-testid="orders-tab"]')
    
    // Mock orders API response
    await page.route('**/api/v1/orders*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orders: [
              {
                id: 'order-1',
                customerName: 'Ahmed Ali',
                customerPhone: '+92 300 1234567',
                totalAmount: 2000,
                currency: 'PKR',
                status: 'pending',
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                createdAt: new Date().toISOString(),
                items: [
                  {
                    id: 'item-1',
                    name: 'Test Product',
                    quantity: 1,
                    price: 2000
                  }
                ],
                shippingAddress: {
                  addressLine1: '123 Main Street',
                  city: 'Karachi',
                  phone: '+92 300 1234567'
                }
              }
            ],
            pagination: {
              page: 1,
              limit: 20,
              total: 1,
              pages: 1
            }
          }
        })
      })
    })
    
    // Verify orders table loads
    await expect(page.locator('[data-testid="orders-table"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-row"]')).toContainText('Ahmed Ali')
    await expect(page.locator('[data-testid="order-row"]')).toContainText('Rs. 2,000')
    
    // Click to view order details
    await page.click('[data-testid="view-order"]')
    
    // Verify order details modal
    await expect(page.locator('[data-testid="order-details-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="customer-info"]')).toContainText('Ahmed Ali')
    await expect(page.locator('[data-testid="shipping-address"]')).toContainText('123 Main Street')
    
    // Update order status
    await page.selectOption('[data-testid="status-select"]', 'confirmed')
    await page.fill('[data-testid="status-notes"]', 'Order confirmed and ready for processing')
    
    // Mock status update API
    await page.route('**/api/v1/orders/*/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orderId: 'order-1',
            status: 'confirmed',
            updatedAt: new Date().toISOString()
          }
        })
      })
    })
    
    await page.click('[data-testid="update-status"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Order status updated successfully')
  })

  test('should enforce package restrictions', async ({ page }) => {
    // Try to access OAuth integration (requires PRO package)
    await page.click('[data-testid="social-integration-tab"]')
    
    // Click "Connect Instagram" (should show upgrade prompt)
    await page.click('[data-testid="connect-instagram"]')
    
    // Verify upgrade prompt appears
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible()
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toContainText('Upgrade to PRO for OAuth integration')
    
    // Verify manual import is still available for STARTER
    await page.click('[data-testid="manual-import"]')
    await expect(page.locator('[data-testid="import-link-form"]')).toBeVisible()
  })

  test('should handle RTL layout for Urdu content', async ({ page }) => {
    // Create website with Urdu language
    await page.click('[data-testid="create-website-button"]')
    await page.click('[data-testid="template-micro-store"]')
    await page.fill('[data-testid="website-name"]', 'میرا ہینڈ میڈ جیولری اسٹور')
    await page.selectOption('[data-testid="language-select"]', 'URDU')
    await page.click('[data-testid="create-website-submit"]')
    
    // Verify RTL layout
    await expect(page.locator('[data-testid="editor-canvas"]')).toHaveAttribute('dir', 'rtl')
    
    // Add Urdu product
    await page.click('[data-testid="products-tab"]')
    await page.click('[data-testid="add-product-button"]')
    await page.fill('[data-testid="product-name"]', 'چاندی کا ہار')
    await page.fill('[data-testid="product-description"]', 'خوبصورت ہاتھ سے بنایا گیا چاندی کا ہار')
    await page.fill('[data-testid="product-price"]', '2500')
    await page.fill('[data-testid="product-image-url"]', 'https://example.com/urdu-necklace.jpg')
    await page.click('[data-testid="save-product"]')
    
    // Switch to preview and verify RTL layout
    await page.click('[data-testid="preview-button"]')
    await expect(page.locator('[data-testid="product-card"]')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('[data-testid="product-card"]')).toContainText('چاندی کا ہار')
  })

  test('should publish micro-store website', async ({ page }) => {
    // Add a product first
    await page.click('[data-testid="products-tab"]')
    await page.click('[data-testid="add-product-button"]')
    await page.fill('[data-testid="product-name"]', 'Published Product')
    await page.fill('[data-testid="product-price"]', '3000')
    await page.fill('[data-testid="product-image-url"]', 'https://example.com/published.jpg')
    await page.click('[data-testid="save-product"]')
    
    // Mock publish API
    await page.route('**/api/v1/publish', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            publishId: 'publish-123',
            status: 'queued',
            url: 'https://my-store.pakistanbuilder.com'
          }
        })
      })
    })
    
    // Click publish
    await page.click('[data-testid="publish-button"]')
    
    // Verify publish success
    await expect(page.locator('[data-testid="publish-success"]')).toContainText('Website published successfully')
    await expect(page.locator('[data-testid="published-url"]')).toContainText('https://my-store.pakistanbuilder.com')
    
    // Click to visit published site
    await page.click('[data-testid="visit-published-site"]')
    
    // Verify published site loads with products
    await expect(page.locator('[data-testid="published-product"]')).toContainText('Published Product')
    await expect(page.locator('[data-testid="published-product"]')).toContainText('Rs. 3,000')
  })
})
