import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const MenuSectionConfig: ComponentConfig = {
  id: 'menu-section',
  name: 'Menu Section',
  category: 'content',
  icon: 'Menu',
  description: 'Display restaurant menu items',
  defaultProps: {
    title: 'Our Menu',
    subtitle: 'Delicious dishes made with fresh ingredients',
    categories: [
      {
        id: '1',
        name: 'Appetizers',
        items: [
          {
            id: '1',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce, parmesan cheese, croutons, and our signature Caesar dressing',
            price: 12.99,
            image: '/menu/caesar-salad.jpg',
            allergens: ['dairy', 'gluten'],
            spicy: false,
            vegetarian: true
          },
          {
            id: '2',
            name: 'Buffalo Wings',
            description: 'Crispy chicken wings tossed in our spicy buffalo sauce, served with celery and blue cheese',
            price: 14.99,
            image: '/menu/buffalo-wings.jpg',
            allergens: ['dairy'],
            spicy: true,
            vegetarian: false
          },
          {
            id: '3',
            name: 'Bruschetta',
            description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and mozzarella',
            price: 10.99,
            image: '/menu/bruschetta.jpg',
            allergens: ['gluten', 'dairy'],
            spicy: false,
            vegetarian: true
          }
        ]
      },
      {
        id: '2',
        name: 'Main Courses',
        items: [
          {
            id: '4',
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and rice',
            price: 24.99,
            image: '/menu/grilled-salmon.jpg',
            allergens: ['fish'],
            spicy: false,
            vegetarian: false
          },
          {
            id: '5',
            name: 'Beef Tenderloin',
            description: '8oz tenderloin steak cooked to your preference, served with mashed potatoes and asparagus',
            price: 32.99,
            image: '/menu/beef-tenderloin.jpg',
            allergens: [],
            spicy: false,
            vegetarian: false
          },
          {
            id: '6',
            name: 'Vegetarian Pasta',
            description: 'House-made pasta with seasonal vegetables, herbs, and olive oil',
            price: 18.99,
            image: '/menu/vegetarian-pasta.jpg',
            allergens: ['gluten'],
            spicy: false,
            vegetarian: true
          }
        ]
      },
      {
        id: '3',
        name: 'Desserts',
        items: [
          {
            id: '7',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
            price: 8.99,
            image: '/menu/lava-cake.jpg',
            allergens: ['dairy', 'eggs', 'gluten'],
            spicy: false,
            vegetarian: true
          },
          {
            id: '8',
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
            price: 7.99,
            image: '/menu/tiramisu.jpg',
            allergens: ['dairy', 'eggs'],
            spicy: false,
            vegetarian: true
          }
        ]
      }
    ],
    showPrices: true,
    showAllergens: true,
    showSpicy: true,
    showVegetarian: true,
    layout: 'categories'
  },
  defaultSize: { width: 800, height: 1000 },
  editableFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' }
  ]
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  allergens?: string[]
  spicy?: boolean
  vegetarian?: boolean
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

interface MenuSectionProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  categories?: MenuCategory[]
  showPrices?: boolean
  showAllergens?: boolean
  showSpicy?: boolean
  showVegetarian?: boolean
  layout?: 'categories' | 'grid'
}

export const MenuSection: React.FC<MenuSectionProps> = ({ 
  deviceMode = 'desktop',
  title = 'Our Menu',
  subtitle = 'Delicious dishes made with fresh ingredients',
  categories = [],
  showPrices = true,
  showAllergens = true,
  showSpicy = true,
  showVegetarian = true,
  layout = 'categories'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const categoryTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const itemTitleSize = getResponsiveTextSize('text-base', deviceMode)
  const priceSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)
  }
  
  const getAllergenIcon = (allergen: string) => {
    const icons: Record<string, string> = {
      dairy: '🥛',
      gluten: '🌾',
      eggs: '🥚',
      nuts: '🥜',
      fish: '🐟',
      shellfish: '🦐',
      soy: '🫘'
    }
    return icons[allergen] || '⚠️'
  }
  
  if (layout === 'grid') {
    // Flatten all items for grid layout
    const allItems = (categories || []).flatMap(category => category.items || [])
    
    return (
      <Card className={`w-full h-full flex flex-col ${padding}`}>
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
            {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold">Menu</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold ${itemTitleSize}`}>{item.name}</h4>
                    {showPrices && (
                      <span className={`font-bold text-orange-600 ${priceSize}`}>
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-gray-600 mb-3 ${textSize}`}>{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {showVegetarian && item.vegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        🌱 Vegetarian
                      </span>
                    )}
                    {showSpicy && item.spicy && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        🌶️ Spicy
                      </span>
                    )}
                    {showAllergens && item.allergens && item.allergens.map((allergen) => (
                      <span key={allergen} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {getAllergenIcon(allergen)} {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }
  
  // Categories layout
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
          {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-8">
        {(categories || []).map((category) => (
          <div key={category.id}>
            <h4 className={`font-bold mb-4 ${categoryTitleSize} border-b border-gray-200 pb-2`}>
              {category.name}
            </h4>
            
            <div className="space-y-4">
              {(category.items || []).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className={`font-semibold ${itemTitleSize}`}>{item.name}</h5>
                    {showPrices && (
                      <span className={`font-bold text-orange-600 ${priceSize}`}>
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-gray-600 mb-3 ${textSize}`}>{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {showVegetarian && item.vegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        🌱 Vegetarian
                      </span>
                    )}
                    {showSpicy && item.spicy && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        🌶️ Spicy
                      </span>
                    )}
                    {showAllergens && item.allergens && item.allergens.map((allergen) => (
                      <span key={allergen} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {getAllergenIcon(allergen)} {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
