"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { useWebsiteStore } from '@/lib/store'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  AlertTriangle
} from '@/lib/icons'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ProductsPage() {
  const { 
    products, 
    isLoading, 
    selectedWebsite, 
    setSelectedWebsite,
    productFilters,
    setProductFilters,
    fetchProducts,
    deleteProduct,
    bulkUpdateProducts
  } = useEcommerceStore()
  
  const { websites } = useWebsiteStore()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (selectedWebsite) {
      fetchProducts()
    }
  }, [selectedWebsite, productFilters])

  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsite(websiteId)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setProductFilters({ search: value, page: 1 })
  }

  const handleStatusFilter = (status: string) => {
    setProductFilters({ status: status === 'all' ? undefined : status, page: 1 })
  }

  const handleSort = (sortBy: string) => {
    setProductFilters({ sortBy, page: 1 })
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first')
      return
    }

    try {
      switch (action) {
        case 'activate':
          await bulkUpdateProducts(selectedProducts, { status: 'ACTIVE' })
          toast.success(`${selectedProducts.length} products activated`)
          break
        case 'deactivate':
          await bulkUpdateProducts(selectedProducts, { status: 'INACTIVE' })
          toast.success(`${selectedProducts.length} products deactivated`)
          break
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            await Promise.all(selectedProducts.map(id => deleteProduct(id)))
            toast.success(`${selectedProducts.length} products deleted`)
          }
          break
      }
      setSelectedProducts([])
    } catch (error) {
      toast.error('Failed to perform bulk action')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default">Active</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>
      case 'OUT_OF_STOCK':
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStockStatus = (product: any) => {
    if (!product.trackInventory) return null
    
    if (product.inventory <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (product.inventory <= product.lowStockThreshold) {
      return <Badge variant="outline" className="text-orange-600">Low Stock</Badge>
    } else {
      return <Badge variant="outline" className="text-green-600">In Stock</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Website Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Website:</label>
            <select
              value={selectedWebsite || ''}
              onChange={(e) => handleWebsiteChange(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Select a website</option>
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.name}
                </option>
              ))}
            </select>
          </div>

          <Button asChild>
            <Link href="/dashboard/ecommerce/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {!selectedWebsite ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Website Selected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select a website to view and manage its products.
            </p>
            <Button asChild>
              <Link href="/dashboard/websites">
                Go to Websites
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, SKU, or description..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="sm:w-48">
                  <Label>Status</Label>
                  <Select onValueChange={handleStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:w-48">
                  <Label>Sort By</Label>
                  <Select onValueChange={handleSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="updatedAt">Last Updated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedProducts.length} product{selectedProducts.length === 1 ? '' : 's'} selected
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('activate')}
                    >
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('deactivate')}
                    >
                      Deactivate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleBulkAction('delete')}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <Card key={product.id} className="relative">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Product Image Placeholder */}
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product.id])
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                              }
                            }}
                            className="ml-2"
                          />
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg">
                            {formatCurrency(product.price)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(product.comparePrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {getStatusBadge(product.status)}
                          {getStockStatus(product)}
                        </div>

                        {product.trackInventory && (
                          <div className="text-sm text-muted-foreground">
                            Stock: {product.inventory} units
                          </div>
                        )}

                        {product.sku && (
                          <div className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/dashboard/ecommerce/products/${product.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || productFilters.status 
                      ? 'No products match your current filters.' 
                      : 'Get started by adding your first product.'}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/ecommerce/products/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {products.length} products
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={productFilters.page === 1}
                      onClick={() => setProductFilters({ page: productFilters.page - 1 })}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProductFilters({ page: productFilters.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
