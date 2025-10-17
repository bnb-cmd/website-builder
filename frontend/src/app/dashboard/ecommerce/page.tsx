"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { useWebsiteStore } from '@/lib/store'
import { 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Settings,
  BarChart3
} from '@/lib/icons'
import Link from 'next/link'

export default function EcommerceDashboard() {
  const { 
    analytics, 
    isLoading, 
    selectedWebsite, 
    setSelectedWebsite,
    fetchOrderAnalytics 
  } = useEcommerceStore()
  
  const { websites } = useWebsiteStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')

  useEffect(() => {
    if (selectedWebsite) {
      fetchOrderAnalytics()
    }
  }, [selectedWebsite, selectedPeriod])

  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsite(websiteId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PK').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">E-commerce Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your online store, track sales, and analyze performance
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
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Website Selected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select a website to view its e-commerce analytics and manage products.
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
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics ? formatCurrency(analytics.totalRevenue) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time sales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics ? formatNumber(analytics.totalOrders) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics ? formatCurrency(analytics.averageOrderValue) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per order average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics ? formatNumber(analytics.topProducts.length) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Products with sales
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="products">Top Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Orders by Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Orders by Status</CardTitle>
                    <CardDescription>Current order distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics?.ordersByStatus ? (
                      <div className="space-y-2">
                        {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="capitalize">
                                {status.toLowerCase()}
                              </Badge>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Revenue Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics?.revenueByPeriod ? (
                      <div className="space-y-2">
                        {analytics.revenueByPeriod.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{item.period}</span>
                            <span className="font-medium">{formatCurrency(item.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/ecommerce/orders">
                        <Eye className="w-4 h-4 mr-2" />
                        View All Orders
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best performing products</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.topProducts ? (
                    <div className="space-y-3">
                      {analytics.topProducts.slice(0, 5).map((product, index) => (
                        <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.sales} sales
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(product.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No product data available</p>
                  )}
                  
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/ecommerce/products">
                        <Package className="w-4 h-4 mr-2" />
                        Manage Products
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Detailed performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/ecommerce/analytics">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Detailed Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common e-commerce tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button asChild variant="outline" className="h-auto p-4">
                  <Link href="/dashboard/ecommerce/products/new">
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Add Product</div>
                      <div className="text-sm text-muted-foreground">Create new product</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4">
                  <Link href="/dashboard/ecommerce/orders">
                    <div className="text-center">
                      <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">View Orders</div>
                      <div className="text-sm text-muted-foreground">Manage orders</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4">
                  <Link href="/dashboard/ecommerce/customers">
                    <div className="text-center">
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Customers</div>
                      <div className="text-sm text-muted-foreground">View customers</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4">
                  <Link href="/dashboard/ecommerce/settings">
                    <div className="text-center">
                      <Settings className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Settings</div>
                      <div className="text-sm text-muted-foreground">Configure store</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
