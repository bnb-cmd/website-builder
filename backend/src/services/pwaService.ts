import { PwaSettings, Website } from '@prisma/client'
import { BaseService } from './baseService'
import { WebsiteService } from './websiteService'

export interface PwaSettingsData {
  name: string
  shortName: string
  description?: string
  themeColor?: string
  backgroundColor?: string
  display?: 'standalone' | 'fullscreen' | 'minimal-ui'
  orientation?: 'portrait' | 'landscape'
  startUrl?: string
  icon512?: string
  icon192?: string
}

export class PwaService extends BaseService<PwaSettings> {
  private websiteService: WebsiteService

  constructor() {
    super()
    this.websiteService = new WebsiteService()
  }

  protected getModelName(): string {
    return 'pwaSettings'
  }

  async getByWebsiteId(websiteId: string): Promise<PwaSettings | null> {
    try {
      this.validateId(websiteId)
      return await this.prisma.pwaSettings.findUnique({ where: { websiteId } })
    } catch (error) {
      this.handleError(error)
    }
  }

  async createOrUpdate(websiteId: string, data: PwaSettingsData): Promise<PwaSettings> {
    try {
      this.validateId(websiteId)
      const existingSettings = await this.getByWebsiteId(websiteId)
      if (existingSettings) {
        return await this.update(existingSettings.id, data)
      } else {
        return await this.create({ ...data, websiteId })
      }
    } catch (error) {
      this.handleError(error)
    }
  }
  
  public generateManifest(settings: PwaSettings, website: Website): Record<string, any> {
    return {
      name: settings.name || website.name,
      short_name: settings.shortName || website.name,
      description: settings.description || website.description,
      theme_color: settings.themeColor,
      background_color: settings.backgroundColor,
      display: settings.display,
      orientation: settings.orientation,
      scope: settings.scope,
      start_url: settings.startUrl,
      icons: [
        {
          src: settings.icon192,
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: settings.icon512,
          sizes: "512x512",
          type: "image/png",
        },
      ],
    }
  }

  public generateServiceWorker(websiteId: string): string {
    const cacheName = `pwa-cache-${websiteId}-v1`
    const assetsToCache = [
      '/',
      '/offline.html'
    ]

    return `
      self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open('${cacheName}').then((cache) => {
            return cache.addAll(${JSON.stringify(assetsToCache)});
          })
        );
      });

      self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request).then((response) => {
            return response || fetch(event.request);
          })
        );
      });
    `
  }

  // Required abstract methods from BaseService
  async create(data: any): Promise<PwaSettings> {
    return this.prisma.pwaSettings.create({ data })
  }
  async findById(id: string): Promise<PwaSettings | null> {
    return this.prisma.pwaSettings.findUnique({ where: { id } })
  }
  async findAll(filters?: any): Promise<PwaSettings[]> {
    return this.prisma.pwaSettings.findMany({ where: filters })
  }
  async update(id: string, data: Partial<PwaSettings>): Promise<PwaSettings> {
    return this.prisma.pwaSettings.update({ where: { id }, data })
  }
  async delete(id: string): Promise<boolean> {
    await this.prisma.pwaSettings.delete({ where: { id } })
    return true
  }
}
