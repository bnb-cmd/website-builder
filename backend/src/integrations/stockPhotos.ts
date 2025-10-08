import axios from 'axios'

export interface StockPhotoConfig {
  unsplash: {
    accessKey: string
    baseUrl: string
  }
  pexels: {
    apiKey: string
    baseUrl: string
  }
  pixabay: {
    apiKey: string
    baseUrl: string
  }
}

export interface StockPhotoResult {
  id: string
  url: string
  thumbnail: string
  width: number
  height: number
  photographer: string
  photographerUrl?: string
  source: 'unsplash' | 'pexels' | 'pixabay'
  license: string
  tags: string[]
}

export interface StockPhotoSearchOptions {
  query: string
  category?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  color?: string
  page?: number
  perPage?: number
}

export class StockPhotoService {
  private config: StockPhotoConfig

  constructor(config: StockPhotoConfig) {
    this.config = config
  }

  // Unsplash Integration
  async searchUnsplash(options: StockPhotoSearchOptions): Promise<StockPhotoResult[]> {
    try {
      const { query, orientation, color, page = 1, perPage = 20 } = options
      
      const params = new URLSearchParams({
        query,
        page: page.toString(),
        per_page: perPage.toString(),
        client_id: this.config.unsplash.accessKey
      })

      if (orientation) {
        params.append('orientation', orientation)
      }

      if (color) {
        params.append('color', color)
      }

      const response = await axios.get(`${this.config.unsplash.baseUrl}/search/photos?${params}`)
      
      return response.data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.full,
        thumbnail: photo.urls.thumb,
        width: photo.width,
        height: photo.height,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        source: 'unsplash' as const,
        license: 'free',
        tags: photo.tags?.map((tag: any) => tag.title) || []
      }))
    } catch (error) {
      console.error('Unsplash API error:', error)
      return []
    }
  }

  async getUnsplashRandom(category?: string): Promise<StockPhotoResult[]> {
    try {
      const params = new URLSearchParams({
        client_id: this.config.unsplash.accessKey,
        count: '20'
      })

      if (category) {
        params.append('query', category)
      }

      const response = await axios.get(`${this.config.unsplash.baseUrl}/photos/random?${params}`)
      
      return response.data.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.full,
        thumbnail: photo.urls.thumb,
        width: photo.width,
        height: photo.height,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        source: 'unsplash' as const,
        license: 'free',
        tags: photo.tags?.map((tag: any) => tag.title) || []
      }))
    } catch (error) {
      console.error('Unsplash random API error:', error)
      return []
    }
  }

  // Pexels Integration
  async searchPexels(options: StockPhotoSearchOptions): Promise<StockPhotoResult[]> {
    try {
      const { query, orientation, color, page = 1, perPage = 20 } = options
      
      const params = new URLSearchParams({
        query,
        page: page.toString(),
        per_page: perPage.toString()
      })

      if (orientation) {
        params.append('orientation', orientation)
      }

      if (color) {
        params.append('color', color)
      }

      const response = await axios.get(`${this.config.pexels.baseUrl}/v1/search`, {
        headers: {
          'Authorization': this.config.pexels.apiKey
        },
        params
      })
      
      return response.data.photos.map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.src.large2x,
        thumbnail: photo.src.medium,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: 'pexels' as const,
        license: 'free',
        tags: []
      }))
    } catch (error) {
      console.error('Pexels API error:', error)
      return []
    }
  }

  async getPexelsCurated(page = 1, perPage = 20): Promise<StockPhotoResult[]> {
    try {
      const response = await axios.get(`${this.config.pexels.baseUrl}/v1/curated`, {
        headers: {
          'Authorization': this.config.pexels.apiKey
        },
        params: {
          page,
          per_page: perPage
        }
      })
      
      return response.data.photos.map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.src.large2x,
        thumbnail: photo.src.medium,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: 'pexels' as const,
        license: 'free',
        tags: []
      }))
    } catch (error) {
      console.error('Pexels curated API error:', error)
      return []
    }
  }

  // Pixabay Integration
  async searchPixabay(options: StockPhotoSearchOptions): Promise<StockPhotoResult[]> {
    try {
      const { query, orientation, color, page = 1, perPage = 20 } = options
      
      const params = new URLSearchParams({
        key: this.config.pixabay.apiKey,
        q: query,
        page: page.toString(),
        per_page: perPage.toString(),
        image_type: 'photo',
        safesearch: 'true'
      })

      if (orientation) {
        params.append('orientation', orientation)
      }

      if (color) {
        params.append('colors', color)
      }

      const response = await axios.get(`${this.config.pixabay.baseUrl}/api/`, { params })
      
      return response.data.hits.map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.largeImageURL,
        thumbnail: photo.previewURL,
        width: photo.imageWidth,
        height: photo.imageHeight,
        photographer: photo.user,
        photographerUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
        source: 'pixabay' as const,
        license: 'free',
        tags: photo.tags.split(', ')
      }))
    } catch (error) {
      console.error('Pixabay API error:', error)
      return []
    }
  }

  // Unified Search - Search across all sources
  async searchAll(options: StockPhotoSearchOptions): Promise<StockPhotoResult[]> {
    try {
      const [unsplashResults, pexelsResults, pixabayResults] = await Promise.all([
        this.searchUnsplash(options),
        this.searchPexels(options),
        this.searchPixabay(options)
      ])

      // Combine and shuffle results
      const allResults = [...unsplashResults, ...pexelsResults, ...pixabayResults]
      return this.shuffleArray(allResults)
    } catch (error) {
      console.error('Unified search error:', error)
      return []
    }
  }

  // Get random images from all sources
  async getRandomAll(category?: string): Promise<StockPhotoResult[]> {
    try {
      const [unsplashResults, pexelsResults, pixabayResults] = await Promise.all([
        this.getUnsplashRandom(category),
        this.getPexelsCurated(),
        this.searchPixabay({ query: category || 'nature', perPage: 10 })
      ])

      const allResults = [...unsplashResults, ...pexelsResults, ...pixabayResults]
      return this.shuffleArray(allResults).slice(0, 20)
    } catch (error) {
      console.error('Random images error:', error)
      return []
    }
  }

  // Download and cache image
  async downloadImage(photo: StockPhotoResult): Promise<Buffer> {
    try {
      const response = await axios.get(photo.url, {
        responseType: 'arraybuffer'
      })
      return Buffer.from(response.data)
    } catch (error) {
      console.error('Image download error:', error)
      throw new Error('Failed to download image')
    }
  }

  // Helper function to shuffle array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Get popular categories
  getPopularCategories(): string[] {
    return [
      'business',
      'technology',
      'food',
      'medical',
      'real-estate',
      'education',
      'ecommerce',
      'lifestyle',
      'abstract',
      'nature',
      'people',
      'architecture',
      'travel',
      'fitness',
      'art'
    ]
  }

  // Get color options
  getColorOptions(): string[] {
    return [
      'black_and_white',
      'black',
      'white',
      'yellow',
      'orange',
      'red',
      'purple',
      'magenta',
      'green',
      'teal',
      'blue'
    ]
  }
}

// Factory function to create service instance
export function createStockPhotoService(): StockPhotoService {
  const config: StockPhotoConfig = {
    unsplash: {
      accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
      baseUrl: 'https://api.unsplash.com'
    },
    pexels: {
      apiKey: process.env.PEXELS_API_KEY || '',
      baseUrl: 'https://api.pexels.com'
    },
    pixabay: {
      apiKey: process.env.PIXABAY_API_KEY || '',
      baseUrl: 'https://pixabay.com'
    }
  }

  return new StockPhotoService(config)
}
