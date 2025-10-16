"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '../../lib/utils'
import { Plus, Edit, Trash2, Upload, Link, Instagram, Facebook, RefreshCw } from 'lucide-react'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  stock?: number
  socialPlatform?: string
  socialPostUrl?: string
  lastSyncedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ProductManagerProps {
  websiteId: string
  products: Product[]
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>
  onDeleteProduct: (id: string) => Promise<void>
  onImportFromSocial: (platform: string) => Promise<void>
  onSyncProducts: () => Promise<void>
  language: 'ENGLISH' | 'URDU'
  className?: string
}

const ProductManager: React.FC<ProductManagerProps> = ({
  websiteId,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onImportFromSocial,
  onSyncProducts,
  language,
  className
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'PKR',
    imageUrl: '',
    stock: 0,
    socialPlatform: '',
    socialPostUrl: ''
  })

  const [importData, setImportData] = useState({
    url: '',
    platform: 'any'
  })

  const translations = {
    ENGLISH: {
      products: 'Products',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      importFromSocial: 'Import from Social Media',
      syncProducts: 'Sync Products',
      name: 'Product Name',
      description: 'Description',
      price: 'Price (PKR)',
      imageUrl: 'Image URL',
      stock: 'Stock Quantity',
      socialPlatform: 'Social Platform',
      socialPostUrl: 'Social Media Post URL',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      import: 'Import',
      sync: 'Sync',
      platform: 'Platform',
      url: 'Post URL',
      any: 'Any Platform',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      facebook: 'Facebook',
      pinterest: 'Pinterest',
      whatsapp: 'WhatsApp',
      lastSynced: 'Last Synced',
      never: 'Never',
      actions: 'Actions',
      noProducts: 'No products found',
      addFirstProduct: 'Add your first product to get started',
      confirmDelete: 'Are you sure you want to delete this product?',
      importSuccess: 'Product imported successfully',
      importError: 'Failed to import product',
      syncSuccess: 'Products synced successfully',
      syncError: 'Failed to sync products'
    },
    URDU: {
      products: 'مصنوعات',
      addProduct: 'مصنوعات شامل کریں',
      editProduct: 'مصنوعات میں ترمیم کریں',
      importFromSocial: 'سوشل میڈیا سے درآمد کریں',
      syncProducts: 'مصنوعات کو ہم آہنگ کریں',
      name: 'مصنوعات کا نام',
      description: 'تفصیل',
      price: 'قیمت (پاکستانی روپے)',
      imageUrl: 'تصویر کا یو آر ایل',
      stock: 'اسٹاک کی مقدار',
      socialPlatform: 'سوشل پلیٹ فارم',
      socialPostUrl: 'سوشل میڈیا پوسٹ یو آر ایل',
      save: 'محفوظ کریں',
      cancel: 'منسوخ کریں',
      delete: 'حذف کریں',
      edit: 'ترمیم',
      import: 'درآمد',
      sync: 'ہم آہنگ',
      platform: 'پلیٹ فارم',
      url: 'پوسٹ یو آر ایل',
      any: 'کوئی بھی پلیٹ فارم',
      instagram: 'انسٹاگرام',
      tiktok: 'ٹک ٹاک',
      facebook: 'فیس بک',
      pinterest: 'پنٹیرسٹ',
      whatsapp: 'واٹس ایپ',
      lastSynced: 'آخری ہم آہنگی',
      never: 'کبھی نہیں',
      actions: 'اعمال',
      noProducts: 'کوئی مصنوعات نہیں ملیں',
      addFirstProduct: 'شروع کرنے کے لیے اپنی پہلی مصنوعات شامل کریں',
      confirmDelete: 'کیا آپ واقعی اس مصنوعات کو حذف کرنا چاہتے ہیں؟',
      importSuccess: 'مصنوعات کامیابی سے درآمد ہوئی',
      importError: 'مصنوعات درآمد کرنے میں ناکام',
      syncSuccess: 'مصنوعات کامیابی سے ہم آہنگ ہوئیں',
      syncError: 'مصنوعات کو ہم آہنگ کرنے میں ناکام'
    }
  }

  const t = translations[language]

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-PK')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'URDU' ? 'ur-PK' : 'en-PK')
  }

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || newProduct.price <= 0) {
      alert(language === 'URDU' ? 'نام اور قیمت درج کریں' : 'Please enter name and price')
      return
    }

    setIsSubmitting(true)
    try {
      await onAddProduct(newProduct)
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        currency: 'PKR',
        imageUrl: '',
        stock: 0,
        socialPlatform: '',
        socialPostUrl: ''
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Add product error:', error)
      alert(language === 'URDU' ? 'مصنوعات شامل کرنے میں خرابی' : 'Error adding product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    setIsSubmitting(true)
    try {
      await onUpdateProduct(editingProduct.id, editingProduct)
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Update product error:', error)
      alert(language === 'URDU' ? 'مصنوعات اپڈیٹ کرنے میں خرابی' : 'Error updating product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t.confirmDelete)) return

    try {
      await onDeleteProduct(id)
    } catch (error) {
      console.error('Delete product error:', error)
      alert(language === 'URDU' ? 'مصنوعات حذف کرنے میں خرابی' : 'Error deleting product')
    }
  }

  const handleImportFromSocial = async () => {
    if (!importData.url.trim()) {
      alert(language === 'URDU' ? 'یو آر ایل درج کریں' : 'Please enter URL')
      return
    }

    setIsSubmitting(true)
    try {
      await onImportFromSocial(importData.platform)
      setImportData({ url: '', platform: 'any' })
      setIsImportDialogOpen(false)
    } catch (error) {
      console.error('Import error:', error)
      alert(t.importError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSyncProducts = async () => {
    setIsSyncing(true)
    try {
      await onSyncProducts()
    } catch (error) {
      console.error('Sync error:', error)
      alert(t.syncError)
    } finally {
      setIsSyncing(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      case 'tiktok':
        return <Instagram className="h-4 w-4" />
      case 'facebook':
        return <Facebook className="h-4 w-4" />
      case 'pinterest':
        return <Instagram className="h-4 w-4" />
      default:
        return <Link className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("space-y-6", className)} dir={language === 'URDU' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.products}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Link className="mr-2 h-4 w-4" />
            {t.importFromSocial}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSyncProducts}
            disabled={isSyncing}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")} />
            {t.syncProducts}
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t.addProduct}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t.addProduct}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={language === 'URDU' ? 'مصنوعات کا نام' : 'Product name'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={language === 'URDU' ? 'تفصیل' : 'Description'}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">{t.price}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="imageUrl">{t.imageUrl}</Label>
                  <Input
                    id="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">{t.stock}</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isSubmitting}>
                    {isSubmitting ? (language === 'URDU' ? 'محفوظ کر رہے ہیں...' : 'Saving...') : t.save}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.noProducts}</p>
              <p className="text-gray-400 text-sm mt-2">{t.addFirstProduct}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.name}</TableHead>
                  <TableHead>{t.price}</TableHead>
                  <TableHead>{t.stock}</TableHead>
                  <TableHead>{t.platform}</TableHead>
                  <TableHead>{t.lastSynced}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={(product.stock || 0) === 0 ? "destructive" : (product.stock || 0) <= 5 ? "secondary" : "default"}>
                        {product.stock || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.socialPlatform && (
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(product.socialPlatform)}
                          <span className="text-sm capitalize">{product.socialPlatform}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {product.lastSyncedAt ? formatDate(product.lastSyncedAt) : t.never}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.editProduct}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">{t.name}</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">{t.description}</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-price">{t.price}</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-imageUrl">{t.imageUrl}</Label>
                <Input
                  id="edit-imageUrl"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-stock">{t.stock}</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleUpdateProduct} disabled={isSubmitting}>
                  {isSubmitting ? (language === 'URDU' ? 'اپڈیٹ کر رہے ہیں...' : 'Updating...') : t.save}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.importFromSocial}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="platform">{t.platform}</Label>
              <Select value={importData.platform} onValueChange={(value) => setImportData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t.any}</SelectItem>
                  <SelectItem value="instagram">{t.instagram}</SelectItem>
                  <SelectItem value="tiktok">{t.tiktok}</SelectItem>
                  <SelectItem value="facebook">{t.facebook}</SelectItem>
                  <SelectItem value="pinterest">{t.pinterest}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="url">{t.url}</Label>
              <Input
                id="url"
                value={importData.url}
                onChange={(e) => setImportData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://instagram.com/p/..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleImportFromSocial} disabled={isSubmitting}>
                {isSubmitting ? (language === 'URDU' ? 'درآمد کر رہے ہیں...' : 'Importing...') : t.import}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductManager
