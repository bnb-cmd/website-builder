// Social Media Product Importers
// Handles different tiers of social media integration

import { db } from './db'
import { v4 as uuidv4 } from 'uuid'

export interface ProductData {
  id?: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  originalUrl?: string
  platform: string
  socialProductId?: string
  metadata?: any
}

export interface ImportResult {
  success: boolean
  products: ProductData[]
  errors: string[]
}

// STARTER Tier - Link-Based Import
export async function importFromLink(url: string, websiteId: string): Promise<ProductData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PakistanWebsiteBuilder/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract Open Graph meta tags
    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"[^>]*>/i)
    const descriptionMatch = html.match(/<meta property="og:description" content="([^"]*)"[^>]*>/i)
    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"[^>]*>/i)
    
    // Extract price from description or title
    const priceMatch = html.match(/Rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|PKR\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*PKR/i)
    
    let price = 0
    if (priceMatch) {
      const priceStr = priceMatch[1] || priceMatch[2] || priceMatch[3]
      price = parseFloat(priceStr.replace(/,/g, ''))
    }

    // Detect platform from URL
    let platform = 'unknown'
    if (url.includes('instagram.com')) platform = 'instagram'
    else if (url.includes('tiktok.com')) platform = 'tiktok'
    else if (url.includes('facebook.com')) platform = 'facebook'
    else if (url.includes('pinterest.com')) platform = 'pinterest'

    return {
      name: titleMatch?.[1] || 'Imported Product',
      description: descriptionMatch?.[1] || '',
      price: price || 0,
      currency: 'PKR',
      imageUrl: imageMatch?.[1] || '',
      originalUrl: url,
      platform
    }
  } catch (error) {
    console.error('Error extracting product from URL:', error)
    throw new Error('Failed to extract product data from URL')
  }
}

export async function scrapeProductMeta(url: string): Promise<any> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    // Extract all meta tags
    const metaTags: any = {}
    const metaRegex = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi
    let match
    
    while ((match = metaRegex.exec(html)) !== null) {
      metaTags[match[1]] = match[2]
    }
    
    return metaTags
  } catch (error) {
    console.error('Error scraping meta tags:', error)
    throw new Error('Failed to scrape meta tags')
  }
}

export async function extractProductData(html: string, platform: string): Promise<ProductData> {
  const metaTags = await scrapeProductMeta('data:text/html,' + encodeURIComponent(html))
  
  // Platform-specific extraction logic
  switch (platform) {
    case 'instagram':
      return extractInstagramProduct(metaTags)
    case 'tiktok':
      return extractTikTokProduct(metaTags)
    case 'facebook':
      return extractFacebookProduct(metaTags)
    case 'pinterest':
      return extractPinterestProduct(metaTags)
    default:
      return extractGenericProduct(metaTags)
  }
}

function extractInstagramProduct(metaTags: any): ProductData {
  return {
    name: metaTags['og:title'] || metaTags['twitter:title'] || 'Instagram Product',
    description: metaTags['og:description'] || metaTags['twitter:description'] || '',
    price: extractPrice(metaTags['og:description'] || ''),
    currency: 'PKR',
    imageUrl: metaTags['og:image'] || metaTags['twitter:image'] || '',
    platform: 'instagram'
  }
}

function extractTikTokProduct(metaTags: any): ProductData {
  return {
    name: metaTags['og:title'] || 'TikTok Product',
    description: metaTags['og:description'] || '',
    price: extractPrice(metaTags['og:description'] || ''),
    currency: 'PKR',
    imageUrl: metaTags['og:image'] || '',
    platform: 'tiktok'
  }
}

function extractFacebookProduct(metaTags: any): ProductData {
  return {
    name: metaTags['og:title'] || 'Facebook Product',
    description: metaTags['og:description'] || '',
    price: extractPrice(metaTags['og:description'] || ''),
    currency: 'PKR',
    imageUrl: metaTags['og:image'] || '',
    platform: 'facebook'
  }
}

function extractPinterestProduct(metaTags: any): ProductData {
  return {
    name: metaTags['og:title'] || 'Pinterest Product',
    description: metaTags['og:description'] || '',
    price: extractPrice(metaTags['og:description'] || ''),
    currency: 'PKR',
    imageUrl: metaTags['og:image'] || '',
    platform: 'pinterest'
  }
}

function extractGenericProduct(metaTags: any): ProductData {
  return {
    name: metaTags['og:title'] || metaTags['twitter:title'] || 'Imported Product',
    description: metaTags['og:description'] || metaTags['twitter:description'] || '',
    price: extractPrice(metaTags['og:description'] || metaTags['twitter:description'] || ''),
    currency: 'PKR',
    imageUrl: metaTags['og:image'] || metaTags['twitter:image'] || '',
    platform: 'unknown'
  }
}

function extractPrice(text: string): number {
  const priceMatch = text.match(/Rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|PKR\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*PKR/i)
  
  if (priceMatch) {
    const priceStr = priceMatch[1] || priceMatch[2] || priceMatch[3]
    return parseFloat(priceStr.replace(/,/g, ''))
  }
  
  return 0
}

export async function downloadImageToR2(imageUrl: string, websiteId: string, env: any): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    const fileName = `products/${websiteId}/${uuidv4()}.jpg`
    
    // Upload to R2 bucket
    await env.PRODUCT_IMAGES.put(fileName, imageBuffer, {
      httpMetadata: {
        contentType: 'image/jpeg'
      }
    })
    
    return `https://your-r2-domain.com/${fileName}`
  } catch (error) {
    console.error('Error downloading image to R2:', error)
    throw new Error('Failed to download image')
  }
}

// PRO Tier - OAuth Integration
export async function importFromInstagram(accessToken: string, websiteId: string): Promise<ImportResult> {
  try {
    // Instagram Graph API integration
    const response = await fetch(`https://graph.instagram.com/me/catalog?access_token=${accessToken}`)
    const data = await response.json()
    
    const products: ProductData[] = []
    const errors: string[] = []
    
    if (data.data) {
      for (const item of data.data) {
        try {
          const product: ProductData = {
            name: item.name || 'Instagram Product',
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            currency: item.currency || 'PKR',
            imageUrl: item.image_url || '',
            platform: 'instagram',
            socialProductId: item.id
          }
          products.push(product)
        } catch (error) {
          errors.push(`Failed to process Instagram product ${item.id}: ${error.message}`)
        }
      }
    }
    
    return {
      success: true,
      products,
      errors
    }
  } catch (error) {
    console.error('Instagram import error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}

export async function importFromTikTok(accessToken: string, websiteId: string): Promise<ImportResult> {
  try {
    // TikTok Shop API integration
    const response = await fetch('https://open-api.tiktok.com/shop/v2/product/list', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    
    const products: ProductData[] = []
    const errors: string[] = []
    
    if (data.data?.products) {
      for (const item of data.data.products) {
        try {
          const product: ProductData = {
            name: item.title || 'TikTok Product',
            description: item.description || '',
            price: parseFloat(item.price_info?.price) || 0,
            currency: item.price_info?.currency || 'PKR',
            imageUrl: item.image?.url_list?.[0] || '',
            platform: 'tiktok',
            socialProductId: item.id
          }
          products.push(product)
        } catch (error) {
          errors.push(`Failed to process TikTok product ${item.id}: ${error.message}`)
        }
      }
    }
    
    return {
      success: true,
      products,
      errors
    }
  } catch (error) {
    console.error('TikTok import error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}

export async function importFromFacebookShop(accessToken: string, websiteId: string): Promise<ImportResult> {
  try {
    // Facebook Commerce Manager API integration
    const response = await fetch(`https://graph.facebook.com/v18.0/me/catalog?access_token=${accessToken}`)
    const data = await response.json()
    
    const products: ProductData[] = []
    const errors: string[] = []
    
    if (data.data) {
      for (const item of data.data) {
        try {
          const product: ProductData = {
            name: item.name || 'Facebook Product',
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            currency: item.currency || 'PKR',
            imageUrl: item.image_url || '',
            platform: 'facebook',
            socialProductId: item.id
          }
          products.push(product)
        } catch (error) {
          errors.push(`Failed to process Facebook product ${item.id}: ${error.message}`)
        }
      }
    }
    
    return {
      success: true,
      products,
      errors
    }
  } catch (error) {
    console.error('Facebook import error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}

export async function syncProductImages(productData: ProductData[], websiteId: string, env: any): Promise<ProductData[]> {
  const syncedProducts = []
  
  for (const product of productData) {
    try {
      if (product.imageUrl) {
        const r2Url = await downloadImageToR2(product.imageUrl, websiteId, env)
        product.imageUrl = r2Url
      }
      syncedProducts.push(product)
    } catch (error) {
      console.error(`Failed to sync image for product ${product.name}:`, error)
      syncedProducts.push(product) // Keep product without image
    }
  }
  
  return syncedProducts
}

export function parseProductDescription(text: string, language: string = 'ENGLISH'): { title: string; description: string; price: number } {
  // Extract title (first line or before price)
  const lines = text.split('\n').filter(line => line.trim())
  const title = lines[0] || 'Product'
  
  // Extract price
  const priceMatch = text.match(/Rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|PKR\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*PKR/i)
  const price = priceMatch ? parseFloat((priceMatch[1] || priceMatch[2] || priceMatch[3]).replace(/,/g, '')) : 0
  
  // Extract description (remove title and price)
  let description = text.replace(title, '').replace(priceMatch?.[0] || '', '').trim()
  
  return {
    title: title.substring(0, 200), // Limit title length
    description: description.substring(0, 1000), // Limit description length
    price
  }
}

// ENTERPRISE Tier - Advanced Integration
export async function importFromPinterest(accessToken: string, websiteId: string): Promise<ImportResult> {
  try {
    // Pinterest Shopping API integration
    const response = await fetch('https://api.pinterest.com/v5/catalogs/products', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    
    const products: ProductData[] = []
    const errors: string[] = []
    
    if (data.items) {
      for (const item of data.items) {
        try {
          const product: ProductData = {
            name: item.title || 'Pinterest Product',
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            currency: item.currency || 'PKR',
            imageUrl: item.image_url || '',
            platform: 'pinterest',
            socialProductId: item.id
          }
          products.push(product)
        } catch (error) {
          errors.push(`Failed to process Pinterest product ${item.id}: ${error.message}`)
        }
      }
    }
    
    return {
      success: true,
      products,
      errors
    }
  } catch (error) {
    console.error('Pinterest import error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}

export async function importFromWhatsAppBusiness(accessToken: string, websiteId: string): Promise<ImportResult> {
  try {
    // WhatsApp Business API catalog integration
    const response = await fetch(`https://graph.facebook.com/v18.0/me/catalog?access_token=${accessToken}`)
    const data = await response.json()
    
    const products: ProductData[] = []
    const errors: string[] = []
    
    if (data.data) {
      for (const item of data.data) {
        try {
          const product: ProductData = {
            name: item.name || 'WhatsApp Product',
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            currency: item.currency || 'PKR',
            imageUrl: item.image_url || '',
            platform: 'whatsapp_business',
            socialProductId: item.id
          }
          products.push(product)
        } catch (error) {
          errors.push(`Failed to process WhatsApp product ${item.id}: ${error.message}`)
        }
      }
    }
    
    return {
      success: true,
      products,
      errors
    }
  } catch (error) {
    console.error('WhatsApp import error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}

export async function sendWhatsAppOrderNotification(orderId: string, customerPhone: string, orderData: any, env: any): Promise<boolean> {
  try {
    const message = `🎉 آپ کا آرڈر کنفرم ہو گیا!

آرڈر نمبر: ${orderId}
کل رقم: Rs. ${orderData.totalAmount}
ادائیگی: ${orderData.paymentMethod}

آپ کا آرڈر جلد ہی بھیج دیا جائے گا۔ شکریہ!`

    const response = await fetch('https://graph.facebook.com/v18.0/me/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: customerPhone,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    return response.ok
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return false
  }
}

export async function syncMultiPlatform(websiteId: string, env: any): Promise<ImportResult> {
  try {
    // Get all connected platforms
    const socialLinks = await db.query(env, 'SELECT * FROM social_media_links WHERE website_id = ? AND sync_enabled = true', [websiteId])
    
    const allProducts: ProductData[] = []
    const allErrors: string[] = []
    
    for (const link of socialLinks) {
      try {
        let result: ImportResult
        
        switch (link.platform) {
          case 'instagram':
            result = await importFromInstagram(link.oauth_token, websiteId)
            break
          case 'tiktok':
            result = await importFromTikTok(link.oauth_token, websiteId)
            break
          case 'facebook':
            result = await importFromFacebookShop(link.oauth_token, websiteId)
            break
          case 'pinterest':
            result = await importFromPinterest(link.oauth_token, websiteId)
            break
          case 'whatsapp_business':
            result = await importFromWhatsAppBusiness(link.oauth_token, websiteId)
            break
          default:
            continue
        }
        
        allProducts.push(...result.products)
        allErrors.push(...result.errors)
        
      } catch (error) {
        allErrors.push(`Failed to sync ${link.platform}: ${error.message}`)
      }
    }
    
    return {
      success: allErrors.length === 0,
      products: allProducts,
      errors: allErrors
    }
  } catch (error) {
    console.error('Multi-platform sync error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}

export async function customPlatformIntegration(config: any, websiteId: string): Promise<ImportResult> {
  try {
    // Custom API integration based on configuration
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        websiteId,
        ...config.parameters
      })
    })
    
    const data = await response.json()
    
    const products: ProductData[] = []
    const errors: string[] = []
    
    if (data.products) {
      for (const item of data.products) {
        try {
          const product: ProductData = {
            name: item.name || 'Custom Product',
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            currency: item.currency || 'PKR',
            imageUrl: item.imageUrl || '',
            platform: 'custom',
            socialProductId: item.id,
            metadata: item.metadata
          }
          products.push(product)
        } catch (error) {
          errors.push(`Failed to process custom product ${item.id}: ${error.message}`)
        }
      }
    }
    
    return {
      success: true,
      products,
      errors
    }
  } catch (error) {
    console.error('Custom platform integration error:', error)
    return {
      success: false,
      products: [],
      errors: [error.message]
    }
  }
}
