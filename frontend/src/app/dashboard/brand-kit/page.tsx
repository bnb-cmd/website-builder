"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiHelpers } from '@/lib/api';
import { toast } from 'sonner';
import { 
  Palette, 
  Upload, 
  Type, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download,
  Copy,
  Eye,
  Settings,
  Globe,
  Folder,
  Star,
  Share,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Sample brand kit data
const sampleGlobalBrandKit = {
  id: 'global-1',
  name: 'My Company Brand',
  isDefault: true,
  description: 'Main brand identity for all projects',
  logo: {
    primary: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
    secondary: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
    favicon: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32',
    variations: ['light', 'dark', 'monochrome']
  },
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    neutral: ['#F9FAFB', '#6B7280', '#111827'],
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  typography: {
    heading: 'Inter',
    body: 'Inter',
    accent: 'Playfair Display',
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      h4: '1.25rem',
      h5: '1.125rem',
      h6: '1rem',
      body: '1rem',
      small: '0.875rem'
    }
  },
  imagery: {
    style: 'professional',
    mood: 'modern',
    templates: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400'
    ]
  },
  guidelines: {
    logoUsage: 'Use primary logo on light backgrounds, secondary on dark backgrounds',
    colorUsage: 'Primary color for CTAs, secondary for accents',
    spacing: 'Use 8px grid system for consistent spacing'
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  websites: 5
};

const sampleWebsiteBrandKits = [
  {
    id: 'website-1',
    name: 'Restaurant Brand',
    websiteId: 'website-1',
    websiteName: 'Spice Palace Restaurant',
    inheritsFrom: 'global-1',
    description: 'Custom branding for restaurant website',
    logo: {
      primary: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
      secondary: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
      favicon: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=32'
    },
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1',
      neutral: ['#FFF5F5', '#FFE0E0', '#2D1B1B']
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Dancing Script'
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-12T15:20:00Z'
  },
  {
    id: 'website-2',
    name: 'Tech Startup Brand',
    websiteId: 'website-2',
    websiteName: 'TechFlow Solutions',
    inheritsFrom: 'global-1',
    description: 'Modern tech branding',
    logo: {
      primary: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200',
      secondary: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200',
      favicon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=32'
    },
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      neutral: ['#F8FAFC', '#64748B', '#0F172A']
    },
    typography: {
      heading: 'Inter',
      body: 'Inter',
      accent: 'JetBrains Mono'
    },
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  }
];

export default function BrandKitPage() {
  const [globalBrandKit, setGlobalBrandKit] = useState(sampleGlobalBrandKit);
  const [websiteBrandKits, setWebsiteBrandKits] = useState(sampleWebsiteBrandKits);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingBrandKit, setEditingBrandKit] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBrandKit, setNewBrandKit] = useState({
    name: '',
    description: '',
    websiteId: '',
    inheritsFrom: 'global-1'
  });

  const handleSaveBrandKit = async (brandKitId: string) => {
    setIsLoading(true);
    try {
      if (brandKitId === 'global') {
        await apiHelpers.updateBrandKit(globalBrandKit.id, globalBrandKit);
        toast.success('Global brand kit updated successfully');
      } else {
        const brandKit = websiteBrandKits.find(kit => kit.id === brandKitId);
        if (brandKit) {
          await apiHelpers.updateBrandKit(brandKitId, brandKit);
          toast.success('Brand kit updated successfully');
        }
      }
      setEditingBrandKit(null);
    } catch (error) {
      console.error('Failed to save brand kit:', error);
      toast.error('Failed to save brand kit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBrandKit = async () => {
    if (!newBrandKit.name.trim()) {
      toast.error('Brand kit name is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiHelpers.createBrandKit(newBrandKit);
      setWebsiteBrandKits(prev => [...prev, result.brandKit]);
      toast.success('Brand kit created successfully');
      setShowCreateModal(false);
      setNewBrandKit({ name: '', description: '', websiteId: '', inheritsFrom: 'global-1' });
    } catch (error) {
      console.error('Failed to create brand kit:', error);
      toast.error('Failed to create brand kit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBrandKit = async (brandKitId: string) => {
    const brandKit = websiteBrandKits.find(kit => kit.id === brandKitId);
    if (!brandKit) return;

    if (window.confirm(`Are you sure you want to delete "${brandKit.name}"? This action cannot be undone.`)) {
      try {
        await apiHelpers.deleteBrandKit(brandKitId);
        setWebsiteBrandKits(prev => prev.filter(kit => kit.id !== brandKitId));
        toast.success('Brand kit deleted successfully');
      } catch (error) {
        console.error('Failed to delete brand kit:', error);
        toast.error('Failed to delete brand kit');
      }
    }
  };

  const handleExportBrandKit = async (brandKitId: string) => {
    try {
      const result = await apiHelpers.exportBrandKit(brandKitId);
      
      // Create and download the export file
      const dataStr = JSON.stringify(result.exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `brand-kit-${brandKitId}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Brand kit exported successfully');
    } catch (error) {
      console.error('Failed to export brand kit:', error);
      toast.error('Failed to export brand kit');
    }
  };

  const handleDuplicateBrandKit = async (brandKitId: string) => {
    try {
      const result = await apiHelpers.duplicateBrandKit(brandKitId);
      setWebsiteBrandKits(prev => [...prev, result.brandKit]);
      toast.success('Brand kit duplicated successfully');
    } catch (error) {
      console.error('Failed to duplicate brand kit:', error);
      toast.error('Failed to duplicate brand kit');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Brand Kit</h1>
          <p className="text-muted-foreground">
            Manage your brand assets and maintain consistency across all websites
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Brand Kit
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Assets
          </Button>
        </div>
      </div>

      {/* Brand Kit Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brand Kits</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websiteBrandKits.length + 1}</div>
            <p className="text-xs text-muted-foreground">
              +1 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Websites Using Brand</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalBrandKit.websites}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brand Assets</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Logos, colors, fonts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 days</div>
            <p className="text-xs text-muted-foreground">
              ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="global">Global Brand</TabsTrigger>
          <TabsTrigger value="websites">Website Brands</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Global Brand Kit Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Default Brand Kit
                  </div>
                  <Badge variant="default">Global</Badge>
                </CardTitle>
                <CardDescription>
                  Applied to all new websites by default
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={globalBrandKit.logo.primary} 
                    alt="Brand Logo" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{globalBrandKit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {globalBrandKit.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{globalBrandKit.websites} websites</Badge>
                      <Badge variant="outline">Updated 2 days ago</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingBrandKit('global')}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportBrandKit('global')}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateBrandKit('global')}
                    disabled={isLoading}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common brand management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Website Brand Kit
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Brand Assets
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Brand Kit
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Assets
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Website Brand Kits */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Website Brand Kits</CardTitle>
              <CardDescription>
                Custom branding for specific projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {websiteBrandKits.slice(0, 3).map((brandKit) => (
                  <div key={brandKit.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <img 
                      src={brandKit.logo.primary} 
                      alt="Brand Logo" 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{brandKit.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {brandKit.websiteName}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Inherits from Global
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated {new Date(brandKit.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Brand Tab */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Global Brand Kit
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingBrandKit('global')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                This brand kit is applied to all new websites by default
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Brand Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Brand Name</label>
                  <Input 
                    value={globalBrandKit.name} 
                    onChange={(e) => setGlobalBrandKit(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    value={globalBrandKit.description} 
                    onChange={(e) => setGlobalBrandKit(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Logo Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Logo</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <img 
                      src={globalBrandKit.logo.primary} 
                      alt="Primary Logo" 
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">Primary Logo</p>
                    <p className="text-xs text-muted-foreground">Light backgrounds</p>
                  </div>
                  <div className="text-center">
                    <img 
                      src={globalBrandKit.logo.secondary} 
                      alt="Secondary Logo" 
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">Secondary Logo</p>
                    <p className="text-xs text-muted-foreground">Dark backgrounds</p>
                  </div>
                  <div className="text-center">
                    <img 
                      src={globalBrandKit.logo.favicon} 
                      alt="Favicon" 
                      className="w-16 h-16 object-cover rounded mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">Favicon</p>
                    <p className="text-xs text-muted-foreground">Browser tab icon</p>
                  </div>
                </div>
              </div>

              {/* Colors Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Color Palette</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                      style={{ backgroundColor: globalBrandKit.colors.primary }}
                    ></div>
                    <p className="text-sm font-medium">Primary</p>
                    <p className="text-xs text-muted-foreground">{globalBrandKit.colors.primary}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                      style={{ backgroundColor: globalBrandKit.colors.secondary }}
                    ></div>
                    <p className="text-sm font-medium">Secondary</p>
                    <p className="text-xs text-muted-foreground">{globalBrandKit.colors.secondary}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                      style={{ backgroundColor: globalBrandKit.colors.accent }}
                    ></div>
                    <p className="text-sm font-medium">Accent</p>
                    <p className="text-xs text-muted-foreground">{globalBrandKit.colors.accent}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                      style={{ backgroundColor: globalBrandKit.colors.neutral[2] }}
                    ></div>
                    <p className="text-sm font-medium">Neutral</p>
                    <p className="text-xs text-muted-foreground">{globalBrandKit.colors.neutral[2]}</p>
                  </div>
                </div>
              </div>

              {/* Typography Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Typography</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Heading Font</label>
                    <p className="text-sm text-muted-foreground mt-1">{globalBrandKit.typography.heading}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Body Font</label>
                    <p className="text-sm text-muted-foreground mt-1">{globalBrandKit.typography.body}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Accent Font</label>
                    <p className="text-sm text-muted-foreground mt-1">{globalBrandKit.typography.accent}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Brands Tab */}
        <TabsContent value="websites" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Website Brand Kits</h2>
              <p className="text-sm text-muted-foreground">
                Custom branding for specific projects
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Brand Kit
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {websiteBrandKits.map((brandKit) => (
              <Card key={brandKit.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">{brandKit.name}</span>
                    <Badge variant="outline">Website</Badge>
                  </CardTitle>
                  <CardDescription>{brandKit.websiteName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={brandKit.logo.primary} 
                      alt="Brand Logo" 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {brandKit.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Inherits from Global
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: brandKit.colors.primary }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: brandKit.colors.secondary }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: brandKit.colors.accent }}
                    ></div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteBrandKit(brandKit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <CardDescription>
                Rules and best practices for using your brand assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Logo Usage</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{globalBrandKit.guidelines.logoUsage}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Color Usage</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{globalBrandKit.guidelines.colorUsage}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Spacing</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{globalBrandKit.guidelines.spacing}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download Brand Guidelines PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Brand Kit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Create Website Brand Kit
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription>
                Create custom branding for a specific website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Brand Kit Name</label>
                <Input
                  value={newBrandKit.name}
                  onChange={(e) => setNewBrandKit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Restaurant Brand"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newBrandKit.description}
                  onChange={(e) => setNewBrandKit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this brand kit"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Website</label>
                <select
                  value={newBrandKit.websiteId}
                  onChange={(e) => setNewBrandKit(prev => ({ ...prev, websiteId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="">Select Website</option>
                  <option value="website-1">Spice Palace Restaurant</option>
                  <option value="website-2">TechFlow Solutions</option>
                  <option value="website-3">My Portfolio</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Inherit From</label>
                <select
                  value={newBrandKit.inheritsFrom}
                  onChange={(e) => setNewBrandKit(prev => ({ ...prev, inheritsFrom: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="global-1">Global Brand Kit</option>
                  <option value="none">Start from scratch</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleCreateBrandKit}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create Brand Kit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
