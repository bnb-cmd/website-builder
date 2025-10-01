import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Scale, Star, ShoppingCart, Heart, Trash2, CheckCircle } from 'lucide-react'

interface CompareElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CompareElement({ element, onUpdate, viewMode, style, children }: CompareElementProps) {
  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = element.props.products?.filter((product: any) => product.id !== productId) || []
    
    onUpdate(element.id, {
      props: {
        ...element.props,
        products: updatedProducts
      }
    })
  }

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId)
  }

  const handleAddToWishlist = (productId: string) => {
    console.log('Add to wishlist:', productId)
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'table':
        return 'overflow-x-auto'
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      default:
        return 'overflow-x-auto'
    }
  }

  const products = element.props.products || [
    {
      id: '1',
      name: 'Product A',
      price: 29.99,
      originalPrice: 39.99,
      image: '/placeholder-product.jpg',
      rating: 4.5,
      reviews: 128,
      inStock: true,
      features: {
        'Brand': 'Brand A',
        'Color': 'Blue',
        'Size': 'Medium',
        'Material': 'Cotton',
        'Warranty': '1 Year'
      }
    },
    {
      id: '2',
      name: 'Product B',
      price: 34.99,
      originalPrice: 34.99,
      image: '/placeholder-product.jpg',
      rating: 4.2,
      reviews: 95,
      inStock: true,
      features: {
        'Brand': 'Brand B',
        'Color': 'Red',
        'Size': 'Large',
        'Material': 'Polyester',
        'Warranty': '2 Years'
      }
    }
  ]

  const comparisonFields = [
    'Image',
    'Name',
    'Price',
    'Rating',
    'Brand',
    'Color',
    'Size',
    'Material',
    'Warranty',
    'Actions'
  ]

  return (
    <div
      className="w-full"
      style={style}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Scale className="h-8 w-8 mr-3" />
          Product Comparison
        </h1>
        <p className="text-muted-foreground">
          Compare {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Comparison Table */}
      <div className={getLayoutClass()}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-semibold text-foreground bg-muted/50">
                Features
              </th>
              {products.map((product: any) => (
                <th key={product.id} className="text-center p-4 font-semibold text-foreground bg-muted/50 relative">
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="text-sm">{product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* Product Images */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground">Image</td>
              {products.map((product: any) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Product Names */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground">Name</td>
              {products.map((product: any) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="font-medium text-foreground">{product.name}</div>
                </td>
              ))}
            </tr>

            {/* Prices */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground">Price</td>
              {products.map((product: any) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-primary">
                      ${product.price.toFixed(2)}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Ratings */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground">Rating</td>
              {products.map((product: any) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Features */}
            {Object.keys(products[0]?.features || {}).map((feature) => (
              <tr key={feature} className="border-b border-border">
                <td className="p-4 font-medium text-foreground">{feature}</td>
                {products.map((product: any) => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="text-sm text-foreground">
                      {product.features[feature] || '-'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {/* Actions */}
            <tr>
              <td className="p-4 font-medium text-foreground">Actions</td>
              {products.map((product: any) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full py-2 px-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="w-full py-2 px-3 border border-border rounded-md hover:bg-muted transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Wishlist</span>
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No products to compare</h3>
          <p className="text-muted-foreground mb-6">Add products to compare their features</p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Browse Products
          </button>
        </div>
      )}

      {/* Add More Products */}
      {products.length > 0 && products.length < 4 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors">
            Add More Products to Compare
          </button>
        </div>
      )}
    </div>
  )
}
