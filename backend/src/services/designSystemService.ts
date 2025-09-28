import { DesignSystem, DesignSystemStatus } from '@prisma/client'
import { BaseService } from './baseService'

export interface DesignSystemData {
  name: string
  description?: string
  brandName?: string
  brandValues?: string[]
  brandPersonality?: string
  primaryColors?: any[]
  secondaryColors?: any[]
  neutralColors?: any[]
  fontFamilies?: any[]
  fontSizes?: any[]
  spacingScale?: any[]
  borderRadius?: any[]
  shadows?: any[]
  components?: any
}

export interface AIGenerationSettings {
  industry?: string
  targetAudience?: string
  brandPersonality?: string
  colorPreferences?: string[]
  stylePreferences?: string[]
  mood?: string
}

export class DesignSystemService extends BaseService<DesignSystem> {
  
  protected getModelName(): string {
    return 'designSystem'
  }

  async createDesignSystem(websiteId: string, userId: string, data: DesignSystemData): Promise<DesignSystem> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)
      return await this.prisma.designSystem.create({
        data: {
          websiteId,
          userId,
          ...data,
          status: DesignSystemStatus.DRAFT
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getDesignSystems(websiteId: string): Promise<DesignSystem[]> {
    try {
      this.validateId(websiteId)
      return await this.prisma.designSystem.findMany({
        where: { websiteId },
        orderBy: { updatedAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async generateAIDesignSystem(
    websiteId: string, 
    userId: string, 
    prompt: string, 
    settings: AIGenerationSettings
  ): Promise<DesignSystem> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)

      // Create initial design system record
      const designSystem = await this.prisma.designSystem.create({
        data: {
          websiteId,
          userId,
          name: `AI Generated Design System`,
          description: `Generated from prompt: ${prompt}`,
          brandName: settings.industry ? `${settings.industry} Brand` : 'Brand',
          brandValues: settings.targetAudience ? [settings.targetAudience] : [],
          brandPersonality: settings.brandPersonality,
          aiGenerated: true,
          aiPrompt: prompt,
          generationSettings: settings,
          status: DesignSystemStatus.GENERATING
        }
      })

      // Mock AI generation - in reality, you'd integrate with AI services
      setTimeout(async () => {
        try {
          const generatedData = await this.generateDesignSystemData(prompt, settings)
          
          await this.prisma.designSystem.update({
            where: { id: designSystem.id },
            data: {
              ...generatedData,
              status: DesignSystemStatus.COMPLETED
            }
          })
        } catch (error) {
          await this.prisma.designSystem.update({
            where: { id: designSystem.id },
            data: { status: DesignSystemStatus.DRAFT }
          })
        }
      }, 3000) // 3 second delay to simulate AI processing

      return designSystem
    } catch (error) {
      this.handleError(error)
    }
  }

  private async generateDesignSystemData(prompt: string, settings: AIGenerationSettings): Promise<Partial<DesignSystemData>> {
    // Mock AI generation - in reality, you'd use AI to generate design systems
    const industry = settings.industry || 'technology'
    const personality = settings.brandPersonality || 'modern'
    
    // Generate color palettes based on industry and personality
    const colorPalettes = this.generateColorPalette(industry, personality)
    
    // Generate typography based on personality
    const typography = this.generateTypography(personality)
    
    // Generate spacing and layout
    const spacing = this.generateSpacing(personality)
    
    // Generate components
    const components = this.generateComponents(industry, personality)

    return {
      primaryColors: colorPalettes.primary,
      secondaryColors: colorPalettes.secondary,
      neutralColors: colorPalettes.neutral,
      fontFamilies: typography.fontFamilies,
      fontSizes: typography.fontSizes,
      spacingScale: spacing.spacingScale,
      borderRadius: spacing.borderRadius,
      shadows: spacing.shadows,
      components
    }
  }

  private generateColorPalette(industry: string, personality: string) {
    const palettes = {
      technology: {
        primary: [
          { name: 'Primary Blue', hex: '#3B82F6', usage: 'Main brand color' },
          { name: 'Accent Blue', hex: '#1D4ED8', usage: 'Hover states' }
        ],
        secondary: [
          { name: 'Success Green', hex: '#10B981', usage: 'Success states' },
          { name: 'Warning Orange', hex: '#F59E0B', usage: 'Warning states' },
          { name: 'Error Red', hex: '#EF4444', usage: 'Error states' }
        ],
        neutral: [
          { name: 'Gray 900', hex: '#111827', usage: 'Text primary' },
          { name: 'Gray 600', hex: '#4B5563', usage: 'Text secondary' },
          { name: 'Gray 100', hex: '#F3F4F6', usage: 'Background' }
        ]
      },
      healthcare: {
        primary: [
          { name: 'Medical Blue', hex: '#2563EB', usage: 'Main brand color' },
          { name: 'Trust Blue', hex: '#1E40AF', usage: 'Hover states' }
        ],
        secondary: [
          { name: 'Health Green', hex: '#059669', usage: 'Success states' },
          { name: 'Caution Yellow', hex: '#D97706', usage: 'Warning states' },
          { name: 'Alert Red', hex: '#DC2626', usage: 'Error states' }
        ],
        neutral: [
          { name: 'Charcoal', hex: '#374151', usage: 'Text primary' },
          { name: 'Slate', hex: '#64748B', usage: 'Text secondary' },
          { name: 'Light Gray', hex: '#F8FAFC', usage: 'Background' }
        ]
      },
      luxury: {
        primary: [
          { name: 'Gold', hex: '#D4AF37', usage: 'Main brand color' },
          { name: 'Dark Gold', hex: '#B8860B', usage: 'Hover states' }
        ],
        secondary: [
          { name: 'Deep Purple', hex: '#7C3AED', usage: 'Accent color' },
          { name: 'Rich Black', hex: '#1F2937', usage: 'Dark elements' }
        ],
        neutral: [
          { name: 'Charcoal', hex: '#374151', usage: 'Text primary' },
          { name: 'Silver', hex: '#9CA3AF', usage: 'Text secondary' },
          { name: 'Cream', hex: '#FEFEFE', usage: 'Background' }
        ]
      }
    }

    return palettes[industry as keyof typeof palettes] || palettes.technology
  }

  private generateTypography(personality: string) {
    const typography = {
      modern: {
        fontFamilies: [
          { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', weights: [300, 400, 500, 600, 700], usage: 'Primary font' },
          { name: 'JetBrains Mono', url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap', weights: [400, 500, 600], usage: 'Code font' }
        ],
        fontSizes: [
          { name: 'xs', size: 12, lineHeight: 16, usage: 'Small text' },
          { name: 'sm', size: 14, lineHeight: 20, usage: 'Body text' },
          { name: 'base', size: 16, lineHeight: 24, usage: 'Default text' },
          { name: 'lg', size: 18, lineHeight: 28, usage: 'Large text' },
          { name: 'xl', size: 20, lineHeight: 28, usage: 'Heading 4' },
          { name: '2xl', size: 24, lineHeight: 32, usage: 'Heading 3' },
          { name: '3xl', size: 30, lineHeight: 36, usage: 'Heading 2' },
          { name: '4xl', size: 36, lineHeight: 40, usage: 'Heading 1' }
        ]
      },
      traditional: {
        fontFamilies: [
          { name: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap', weights: [400, 500, 600, 700], usage: 'Primary font' },
          { name: 'Source Sans Pro', url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap', weights: [300, 400, 600, 700], usage: 'Body font' }
        ],
        fontSizes: [
          { name: 'xs', size: 11, lineHeight: 16, usage: 'Small text' },
          { name: 'sm', size: 13, lineHeight: 20, usage: 'Body text' },
          { name: 'base', size: 15, lineHeight: 24, usage: 'Default text' },
          { name: 'lg', size: 17, lineHeight: 28, usage: 'Large text' },
          { name: 'xl', size: 19, lineHeight: 28, usage: 'Heading 4' },
          { name: '2xl', size: 22, lineHeight: 32, usage: 'Heading 3' },
          { name: '3xl', size: 28, lineHeight: 36, usage: 'Heading 2' },
          { name: '4xl', size: 34, lineHeight: 40, usage: 'Heading 1' }
        ]
      }
    }

    return typography[personality as keyof typeof typography] || typography.modern
  }

  private generateSpacing(personality: string) {
    const spacing = {
      modern: {
        spacingScale: [
          { name: 'xs', value: 4, usage: 'Tight spacing' },
          { name: 'sm', value: 8, usage: 'Small spacing' },
          { name: 'md', value: 16, usage: 'Medium spacing' },
          { name: 'lg', value: 24, usage: 'Large spacing' },
          { name: 'xl', value: 32, usage: 'Extra large spacing' },
          { name: '2xl', value: 48, usage: 'Section spacing' }
        ],
        borderRadius: [
          { name: 'none', value: 0, usage: 'Sharp corners' },
          { name: 'sm', value: 4, usage: 'Small radius' },
          { name: 'md', value: 8, usage: 'Medium radius' },
          { name: 'lg', value: 12, usage: 'Large radius' },
          { name: 'xl', value: 16, usage: 'Extra large radius' }
        ],
        shadows: [
          { name: 'sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', usage: 'Subtle shadow' },
          { name: 'md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', usage: 'Medium shadow' },
          { name: 'lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', usage: 'Large shadow' },
          { name: 'xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', usage: 'Extra large shadow' }
        ]
      },
      traditional: {
        spacingScale: [
          { name: 'xs', value: 6, usage: 'Tight spacing' },
          { name: 'sm', value: 12, usage: 'Small spacing' },
          { name: 'md', value: 20, usage: 'Medium spacing' },
          { name: 'lg', value: 32, usage: 'Large spacing' },
          { name: 'xl', value: 48, usage: 'Extra large spacing' },
          { name: '2xl', value: 64, usage: 'Section spacing' }
        ],
        borderRadius: [
          { name: 'none', value: 0, usage: 'Sharp corners' },
          { name: 'sm', value: 2, usage: 'Small radius' },
          { name: 'md', value: 6, usage: 'Medium radius' },
          { name: 'lg', value: 10, usage: 'Large radius' },
          { name: 'xl', value: 14, usage: 'Extra large radius' }
        ],
        shadows: [
          { name: 'sm', value: '0 2px 4px 0 rgb(0 0 0 / 0.1)', usage: 'Subtle shadow' },
          { name: 'md', value: '0 6px 8px -2px rgb(0 0 0 / 0.15)', usage: 'Medium shadow' },
          { name: 'lg', value: '0 12px 16px -4px rgb(0 0 0 / 0.15)', usage: 'Large shadow' },
          { name: 'xl', value: '0 24px 32px -8px rgb(0 0 0 / 0.15)', usage: 'Extra large shadow' }
        ]
      }
    }

    return spacing[personality as keyof typeof spacing] || spacing.modern
  }

  private generateComponents(industry: string, personality: string) {
    return {
      buttons: {
        primary: {
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500'
        },
        secondary: {
          backgroundColor: 'transparent',
          color: '#3B82F6',
          border: '2px solid #3B82F6',
          padding: '10px 22px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500'
        }
      },
      cards: {
        default: {
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #E5E7EB'
        }
      },
      inputs: {
        default: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '16px',
          color: '#111827'
        }
      }
    }
  }

  async updateDesignSystem(designSystemId: string, data: Partial<DesignSystemData>): Promise<DesignSystem> {
    try {
      this.validateId(designSystemId)
      return await this.prisma.designSystem.update({
        where: { id: designSystemId },
        data
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async applyDesignSystem(designSystemId: string, websiteId: string): Promise<boolean> {
    try {
      this.validateId(designSystemId)
      this.validateId(websiteId)
      
      // Update design system status
      await this.prisma.designSystem.update({
        where: { id: designSystemId },
        data: { status: DesignSystemStatus.APPLIED }
      })

      // In a real implementation, you would apply the design system to the website
      // This could involve updating CSS variables, component styles, etc.
      console.log(`Applying design system ${designSystemId} to website ${websiteId}`)
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Required abstract methods from BaseService
  async create(data: any): Promise<DesignSystem> {
    return this.prisma.designSystem.create({ data })
  }
  
  async findById(id: string): Promise<DesignSystem | null> {
    return this.prisma.designSystem.findUnique({ where: { id } })
  }
  
  async findAll(filters?: any): Promise<DesignSystem[]> {
    return this.prisma.designSystem.findMany({ where: filters })
  }
  
  async update(id: string, data: Partial<DesignSystem>): Promise<DesignSystem> {
    return this.prisma.designSystem.update({ where: { id }, data })
  }
  
  async delete(id: string): Promise<boolean> {
    await this.prisma.designSystem.delete({ where: { id } })
    return true
  }
}
