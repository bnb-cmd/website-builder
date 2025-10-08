# Template System Documentation

## Overview

The template system provides a comprehensive collection of website templates and reusable blocks for the website builder. This documentation covers the structure, usage, and customization of templates.

## Table of Contents

1. [Template Structure](#template-structure)
2. [Element Configuration](#element-configuration)
3. [Image Library Integration](#image-library-integration)
4. [Block Templates](#block-templates)
5. [Localization Support](#localization-support)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Template Structure

### Basic Template Properties

```typescript
interface Template {
  id: string                    // Unique identifier (lowercase, hyphens only)
  name: string                  // Display name
  category: string              // Business, E-commerce, Restaurant, etc.
  description: string          // Template description
  thumbnail: string            // Preview image path
  isPremium: boolean           // Premium template flag
  tags: string[]              // Searchable tags
  pages: string[]              // Available pages
  features: string[]           // Template features
  elements: Element[]         // Template elements array
  isGlobal?: boolean          // Global template flag
  parentTemplateId?: string    // Parent template for localized versions
  localizedFor?: string        // Localization target (pk, us, etc.)
  heroImageUrl?: string        // Hero background image
  demoImages?: string          // Comma-separated demo images
}
```

### Element Structure

```typescript
interface Element {
  id: string                   // Unique element identifier
  type: string                // Element type (navbar, hero, etc.)
  props: Record<string, any>   // Element properties
  style: Record<string, any>   // CSS styles
  children: Element[]          // Nested elements
}
```

## Element Configuration

### Supported Element Types

#### Navigation Elements
- **navbar**: Main navigation bar
- **mobile-menu**: Mobile navigation menu

#### Hero Sections
- **hero**: Main hero section with background
- **hero-split**: Split-screen hero layout
- **hero-video**: Video background hero

#### Content Sections
- **feature-grid**: Feature showcase grid
- **about-section**: About us section
- **testimonials**: Customer testimonials
- **team-section**: Team member showcase
- **stats-counter**: Animated statistics
- **gallery**: Image gallery
- **timeline**: Timeline component

#### Forms & CTAs
- **contact-form**: Contact form
- **cta-section**: Call-to-action section
- **newsletter**: Newsletter signup

#### E-commerce
- **product-grid**: Product showcase
- **pricing-table**: Pricing plans
- **shopping-cart**: Shopping cart

#### Layout
- **container**: Content container
- **section**: Page section
- **row**: Bootstrap-style row
- **column**: Bootstrap-style column

### Element Builder Functions

Use the `TemplateElementBuilder` class to create consistent elements:

```typescript
import { TemplateElementBuilder } from '@/data/template-elements'

// Create a navbar
const navbar = TemplateElementBuilder.createNavbar(
  'navbar-1',
  'Company Name',
  [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' }
  ],
  'modern'
)

// Create a hero section
const hero = TemplateElementBuilder.createHero(
  'hero-1',
  'Welcome to Our Company',
  'We provide amazing services',
  [
    { text: 'Get Started', link: '/contact', variant: 'primary' },
    { text: 'Learn More', link: '/about', variant: 'secondary' }
  ],
  '/images/hero-bg.jpg',
  'centered'
)
```

## Image Library Integration

### Image Library Service

The image library provides access to stock photos and custom images:

```typescript
import { ImageLibraryService } from '@/services/imageLibraryService'

const imageService = new ImageLibraryService(prisma)

// Search images
const images = await imageService.searchImages('business', 'hero')

// Get images by category
const heroImages = await imageService.getImagesByCategory('hero')

// Add custom image
await imageService.addCustomImage(websiteId, imageData)
```

### Image Picker Component

Use the ImagePicker component in the editor:

```typescript
import ImagePicker from '@/components/editor/ImagePicker'

<ImagePicker
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={(image) => {
    // Handle image selection
    updateElementProperty('backgroundImage', image.url)
  }}
  category="hero"
  title="Choose Hero Background"
/>
```

### Supported Image Sources

- **Unsplash**: High-quality stock photos
- **Pexels**: Free stock photos and videos
- **Pixabay**: Free images and vectors
- **Custom**: User-uploaded images

## Block Templates

Block templates are reusable components that can be added to any page:

### Available Block Categories

1. **Heroes**: Hero sections with different styles
2. **Features**: Feature showcase layouts
3. **Testimonials**: Customer testimonial layouts
4. **Pricing**: Pricing table variations
5. **Contact**: Contact form layouts
6. **Call to Action**: CTA section designs
7. **Team**: Team member showcases
8. **Statistics**: Stats counter layouts
9. **Footers**: Footer designs
10. **Gallery**: Image gallery layouts

### Using Block Templates

```typescript
// Get available blocks
const blocks = await fetch('/api/v1/templates/blocks')

// Add block to page
const newElement = {
  id: `block-${Date.now()}`,
  type: blockTemplate.elements[0].type,
  props: blockTemplate.elements[0].props,
  style: blockTemplate.elements[0].style,
  children: []
}
```

## Localization Support

### Creating Localized Templates

```typescript
// Global template
{
  id: 'restaurant-global',
  name: 'Restaurant Template',
  isGlobal: true,
  // ... global features
}

// Pakistan-specific version
{
  id: 'restaurant-pk',
  name: 'Restaurant Template (Pakistan)',
  parentTemplateId: 'restaurant-global',
  localizedFor: 'pk',
  // ... PK-specific features like JazzCash, EasyPaisa
}
```

### Pakistan-Specific Features

- **Payment Methods**: JazzCash, EasyPaisa, Bank Transfer
- **Currency**: PKR (Pakistani Rupee)
- **Language**: Urdu support flags
- **Local Business Types**: Pakistani business categories
- **Contact Info**: Pakistan-specific contact formats

## API Reference

### Template Endpoints

#### Get All Templates
```http
GET /api/v1/templates
```

Query Parameters:
- `category`: Filter by category
- `isPremium`: Filter by premium status
- `localizedFor`: Filter by localization
- `search`: Search in name, description, tags
- `page`: Page number (pagination)
- `limit`: Items per page

#### Get Template by ID
```http
GET /api/v1/templates/:id
```

#### Use Template
```http
POST /api/v1/templates/use
```

Body:
```json
{
  "templateId": "business-1",
  "websiteName": "My Business Website",
  "userId": "user-id"
}
```

#### Get Block Templates
```http
GET /api/v1/templates/blocks
```

### Image Library Endpoints

#### Search Images
```http
GET /api/v1/image-library/search
```

Query Parameters:
- `q`: Search query
- `category`: Image category
- `source`: Image source (unsplash, pexels, pixabay)
- `isPremium`: Premium filter
- `orientation`: Image orientation
- `page`: Page number
- `limit`: Items per page

#### Get Image Categories
```http
GET /api/v1/image-library/categories
```

#### Upload Custom Image
```http
POST /api/v1/image-library/custom
```

Body: FormData with image file

## Best Practices

### Template Development

1. **Consistent Naming**: Use descriptive, consistent IDs and names
2. **Complete Elements**: Always include complete element configurations
3. **Responsive Design**: Ensure all templates work on mobile devices
4. **Performance**: Optimize images and minimize bundle size
5. **Accessibility**: Include proper alt text and ARIA labels

### Element Configuration

1. **Unique IDs**: Use unique, descriptive element IDs
2. **Proper Props**: Include all necessary properties
3. **Style Consistency**: Use consistent styling patterns
4. **Nested Elements**: Properly structure nested elements
5. **Validation**: Validate all element configurations

### Image Management

1. **Optimization**: Use optimized image formats (WebP, AVIF)
2. **Responsive Images**: Provide multiple image sizes
3. **Fallbacks**: Include fallback images for missing assets
4. **CDN**: Use CDN for fast image delivery
5. **Attribution**: Properly attribute stock photo sources

## Troubleshooting

### Common Issues

#### Template Not Loading
- Check template ID format (lowercase, hyphens only)
- Verify all required fields are present
- Check element configurations for errors

#### Images Not Displaying
- Verify image paths are correct
- Check if images exist in the public directory
- Ensure proper image format and size

#### Element Rendering Issues
- Validate element type is supported
- Check element props are complete
- Verify element ID is unique

#### Performance Issues
- Optimize images (use WebP format)
- Implement lazy loading
- Minimize bundle size
- Use CDN for assets

### Debugging Tools

#### Template Validator
```bash
npm run validate:templates
```

#### Image Optimization
```bash
npm run optimize:images
```

#### Database Migration
```bash
npx prisma migrate dev
```

### Support

For additional support:
- Check the validation report: `backend/validation-report.md`
- Review API documentation: `docs/API.md`
- Contact the development team

## Changelog

### Version 1.0.0
- Initial template system implementation
- 100+ website templates
- 24+ block templates
- Image library integration
- Localization support
- Template validation system

### Future Updates
- More template categories
- Advanced customization options
- AI-powered template generation
- Enhanced image library features
- Improved performance optimizations
