"use client"

import React, { useState, useCallback } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { 
  Save,
  Folder,
  Tag,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Star,
  Heart,
  Download,
  Upload,
  Share,
  Settings,
  Palette,
  Layout,
  Type,
  Image,
  Video,
  Music,
  MapPin,
  Users,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Code,
  Database,
  BarChart,
  PieChart,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react'

interface SaveTemplateDialogProps {
  components: ComponentNode[]
  pageSchema: PageSchema
  onSaveTemplate: (template: {
    name: string
    description: string
    category: string
    tags: string[]
    components: ComponentNode[]
    preview?: string
  }) => void
  onClose: () => void
}

interface TemplateCategory {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({
  components,
  pageSchema,
  onSaveTemplate,
  onClose
}) => {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Template categories
  const categories: TemplateCategory[] = [
    {
      id: 'business',
      name: 'Business',
      icon: <BarChart className="w-4 h-4" />,
      description: 'Professional business websites'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: <Image className="w-4 h-4" />,
      description: 'Personal and creative portfolios'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Online stores and marketplaces'
    },
    {
      id: 'blog',
      name: 'Blog',
      icon: <Type className="w-4 h-4" />,
      description: 'Content and blog websites'
    },
    {
      id: 'landing',
      name: 'Landing Page',
      icon: <Zap className="w-4 h-4" />,
      description: 'Single-page marketing sites'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      icon: <Shield className="w-4 h-4" />,
      description: 'Large corporate websites'
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: <Heart className="w-4 h-4" />,
      description: 'Food and restaurant websites'
    },
    {
      id: 'event',
      name: 'Event',
      icon: <Calendar className="w-4 h-4" />,
      description: 'Event and conference sites'
    },
    {
      id: 'nonprofit',
      name: 'Non-profit',
      icon: <Users className="w-4 h-4" />,
      description: 'Charity and organization sites'
    },
    {
      id: 'education',
      name: 'Education',
      icon: <Database className="w-4 h-4" />,
      description: 'School and educational sites'
    }
  ]

  // Add tag
  const addTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }, [newTag, tags])

  // Remove tag
  const removeTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }, [tags])

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Generate template preview
  const generatePreview = useCallback(() => {
    // This would typically generate a screenshot or preview image
    // For now, we'll create a simple text preview
    const componentTypes = components.map(c => c.type).join(', ')
    return `Template with ${components.length} components: ${componentTypes}`
  }, [components])

  // Handle save
  const handleSave = useCallback(async () => {
    if (!templateName.trim() || !selectedCategory) return

    setIsLoading(true)

    try {
      const template = {
        name: templateName.trim(),
        description: templateDescription.trim(),
        category: selectedCategory,
        tags,
        components: components.map(component => ({
          ...component,
          // Remove any temporary IDs or user-specific data
          id: `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })),
        preview: generatePreview(),
        isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await onSaveTemplate(template)
      onClose()
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setIsLoading(false)
    }
  }, [templateName, templateDescription, selectedCategory, tags, components, isPublic, generatePreview, onSaveTemplate, onClose])

  // Get selected category info
  const selectedCategoryInfo = categories.find(cat => cat.id === selectedCategory)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save as Template</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name" className="text-sm font-medium">
                Template Name *
              </Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="template-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe what this template is for..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Category *</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2 h-auto py-3"
                >
                  {category.icon}
                  <div className="text-left">
                    <div className="text-sm font-medium">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tags</Label>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add tag..."
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Template Preview</Label>
            <Card className="p-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Components:</span>
                  <Badge variant="outline">{components.length}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {components.map(c => c.type).join(', ')}
                </div>
                {selectedCategoryInfo && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {selectedCategoryInfo.icon}
                    <span>{selectedCategoryInfo.name}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="is-public" className="text-sm">
                Make this template public
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!templateName.trim() || !selectedCategory || isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Template</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SaveTemplateDialog
