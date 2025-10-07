"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  FileText, 
  Globe, 
  Share2, 
  Zap,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  Target,
  BarChart3,
  Settings,
  Calendar,
  Users,
  Hash,
  Link,
  Image,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  MessageSquare,
  Share,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Plus,
  Edit,
  Trash2,
  Save,
  Play,
  Pause,
  Clock,
  X
} from 'lucide-react';

// Sample data for demonstration
const seoData = {
  overallScore: 78,
  issues: [
    { type: 'warning', message: 'Meta description too long (165 characters)', priority: 'medium' },
    { type: 'error', message: 'Missing alt text on 3 images', priority: 'high' },
    { type: 'info', message: 'Consider adding more internal links', priority: 'low' }
  ],
  keywords: [
    { keyword: 'website builder pakistan', position: 3, volume: 1200, difficulty: 'medium' },
    { keyword: 'pakistani web design', position: 7, volume: 800, difficulty: 'easy' },
    { keyword: 'urdu website', position: 12, volume: 500, difficulty: 'easy' },
    { keyword: 'ecommerce pakistan', position: 25, volume: 2000, difficulty: 'hard' }
  ],
  socialMedia: {
    platforms: ['facebook', 'twitter', 'instagram', 'linkedin'],
    scheduledPosts: 5,
    engagement: 89
  }
};

const keywordSuggestions = [
  { keyword: 'website builder', volume: 12000, difficulty: 'hard', cpc: 2.5 },
  { keyword: 'web design pakistan', volume: 800, difficulty: 'medium', cpc: 1.8 },
  { keyword: 'online store builder', volume: 5000, difficulty: 'medium', cpc: 3.2 },
  { keyword: 'urdu website design', volume: 300, difficulty: 'easy', cpc: 1.2 },
  { keyword: 'pakistani business website', volume: 600, difficulty: 'easy', cpc: 1.5 }
];

export default function SEOToolsPage() {
  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(seoData);
  const [metaData, setMetaData] = useState({
    title: 'Pakistan Website Builder - Create Beautiful Websites',
    description: 'Build professional websites for Pakistani businesses with our AI-powered website builder. Urdu support, local payments, and mobile-first design.',
    keywords: ['website builder', 'pakistan', 'web design', 'urdu website']
  });
  const [socialPosts, setSocialPosts] = useState([
    {
      id: 1,
      platform: 'facebook',
      content: '🚀 Just launched my new website! Built with Pakistan Website Builder - so easy to use!',
      scheduledAt: '2024-01-15T10:00:00Z',
      status: 'scheduled'
    },
    {
      id: 2,
      platform: 'twitter',
      content: 'Check out my new portfolio website! #WebDesign #Pakistan',
      scheduledAt: '2024-01-15T14:00:00Z',
      status: 'scheduled'
    }
  ]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showPlatformSettings, setShowPlatformSettings] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    platform: 'facebook',
    content: '',
    scheduledAt: '',
    imageUrl: '',
    hashtags: []
  });
  const [sitemapStatus, setSitemapStatus] = useState({
    generated: true,
    lastUpdated: '2024-01-10T09:30:00Z',
    pages: 12,
    urls: 45
  });

  const analyzeWebsite = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResults(prev => ({
        ...prev,
        overallScore: Math.floor(Math.random() * 20) + 70
      }));
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateSitemap = async () => {
    // Simulate sitemap generation
    setSitemapStatus(prev => ({
      ...prev,
      generated: true,
      lastUpdated: new Date().toISOString(),
      pages: prev.pages + 1
    }));
  };

  const scheduleSocialPost = (platform: string) => {
    setNewPost(prev => ({ ...prev, platform }));
    setShowCreatePostModal(true);
  };

  const createNewPost = () => {
    if (!newPost.content.trim()) {
      alert('Please enter post content');
      return;
    }

    const post = {
      id: Date.now(),
      platform: newPost.platform,
      content: newPost.content,
      scheduledAt: newPost.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled' as const,
      imageUrl: newPost.imageUrl,
      hashtags: newPost.hashtags
    };

    setSocialPosts(prev => [...prev, post]);
    setNewPost({
      platform: 'facebook',
      content: '',
      scheduledAt: '',
      imageUrl: '',
      hashtags: []
    });
    setShowCreatePostModal(false);
  };

  const openPlatformSettings = (platform: string) => {
    setShowPlatformSettings(platform);
  };

  const connectPlatform = (platform: string) => {
    alert(`Connecting to ${platform}... This would open OAuth flow in a real implementation.`);
    setShowPlatformSettings(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">SEO Tools</h1>
          <p className="text-muted-foreground">
            Optimize your website for search engines and social media
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Websites</option>
            <option value="site1">My Portfolio</option>
            <option value="site2">Business Site</option>
          </select>
          
          <Button onClick={analyzeWebsite} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze SEO
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SEO Score Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(analysisResults.overallScore)}`}>
              {analysisResults.overallScore}/100
            </div>
            <Progress value={analysisResults.overallScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +5 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisResults.issues.length}</div>
            <p className="text-xs text-muted-foreground">
              {analysisResults.issues.filter(i => i.priority === 'high').length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords Ranked</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisResults.keywords.length}</div>
            <p className="text-xs text-muted-foreground">
              {analysisResults.keywords.filter(k => k.position <= 10).length} in top 10
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoData.socialMedia.scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">
              {seoData.socialMedia.engagement}% engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analysis">SEO Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
          <TabsTrigger value="social" style={{ display: 'none' }}>Social Media</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        {/* SEO Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Issues List */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  SEO Issues
                </CardTitle>
                <CardDescription className="text-sm">
                  Issues that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.issues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        issue.priority === 'high' ? 'bg-red-500' :
                        issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{issue.message}</div>
                        <Badge variant={
                          issue.priority === 'high' ? 'destructive' :
                          issue.priority === 'medium' ? 'secondary' : 'outline'
                        } className="mt-1">
                          {issue.priority} priority
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Rankings */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2" />
                  Keyword Rankings
                </CardTitle>
                <CardDescription className="text-sm">
                  How your keywords are performing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{keyword.keyword}</div>
                        <div className="text-xs text-muted-foreground">
                          Volume: {keyword.volume.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">#{keyword.position}</div>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(keyword.difficulty)}`}>
                          {keyword.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Keyword Research */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Keyword Research
                </CardTitle>
                <CardDescription>
                  Discover new keywords for your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input placeholder="Enter keyword to research..." />
                  <Button>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {keywordSuggestions.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{keyword.keyword}</div>
                        <div className="text-xs text-muted-foreground">
                          Volume: {keyword.volume.toLocaleString()} • CPC: ${keyword.cpc}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                          {keyword.difficulty}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Keyword Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Keyword Suggestions
                </CardTitle>
                <CardDescription>
                  AI-powered keyword recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900">Long-tail Keywords</div>
                    <div className="text-xs text-blue-800 mt-1">
                      "best website builder pakistan", "urdu website design services"
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-sm text-green-900">Local Keywords</div>
                    <div className="text-xs text-green-800 mt-1">
                      "web design karachi", "website builder lahore"
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-sm text-purple-900">Competitor Keywords</div>
                    <div className="text-xs text-purple-800 mt-1">
                      "wix alternative pakistan", "wordpress vs website builder"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Meta Tags Tab */}
        <TabsContent value="meta" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Meta Tags Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Meta Tags Management
                </CardTitle>
                <CardDescription>
                  Optimize your meta tags for better SEO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Page Title</label>
                  <Input 
                    value={metaData.title}
                    onChange={(e) => setMetaData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter page title..."
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {metaData.title.length}/60 characters
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Meta Description</label>
                  <Textarea 
                    value={metaData.description}
                    onChange={(e) => setMetaData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter meta description..."
                    className="mt-1"
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {metaData.description.length}/160 characters
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Keywords</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {metaData.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {keyword}
                        <button 
                          onClick={() => setMetaData(prev => ({
                            ...prev,
                            keywords: prev.keywords.filter((_, i) => i !== index)
                          }))}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Input placeholder="Add keyword..." />
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Meta Tags
                </Button>
              </CardContent>
            </Card>

            {/* Meta Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Search Preview
                </CardTitle>
                <CardDescription>
                  How your page appears in search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-blue-600 text-sm font-medium mb-1">
                    {metaData.title}
                  </div>
                  <div className="text-green-600 text-xs mb-2">
                    https://yourwebsite.com
                  </div>
                  <div className="text-gray-700 text-sm">
                    {metaData.description}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Title Length</span>
                    <Badge variant={metaData.title.length <= 60 ? "default" : "destructive"}>
                      {metaData.title.length}/60
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Description Length</span>
                    <Badge variant={metaData.description.length <= 160 ? "default" : "destructive"}>
                      {metaData.description.length}/160
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Media Tab - Temporarily Disabled */}
        <TabsContent value="social" className="space-y-6" style={{ display: 'none' }}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Social Media Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 mr-2" />
                    Social Media Posts
                  </div>
                  <Button 
                    onClick={() => setShowCreatePostModal(true)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </CardTitle>
                <CardDescription>
                  Schedule and manage your social media content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {socialPosts.map((post) => (
                    <div key={post.id} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.platform === 'facebook' && <Facebook className="h-4 w-4 text-blue-600" />}
                        {post.platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-400" />}
                        {post.platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-600" />}
                        {post.platform === 'linkedin' && <Share className="h-4 w-4 text-blue-700" />}
                        <span className="font-medium text-sm capitalize">{post.platform}</span>
                        <Badge variant="outline" className="text-xs">
                          {post.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{post.content}</div>
                      <div className="text-xs text-muted-foreground">
                        Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Posting Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Auto-Posting Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic social media posting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                    <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        {platform === 'facebook' && <Facebook className="h-4 w-4 text-blue-600" />}
                        {platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-400" />}
                        {platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-600" />}
                        {platform === 'linkedin' && <Share className="h-4 w-4 text-blue-700" />}
                        <span className="font-medium text-sm capitalize">{platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openPlatformSettings(platform)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => scheduleSocialPost(platform)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Auto-posting Frequency</span>
                    <select className="px-2 py-1 border rounded text-sm">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Content Type</span>
                    <select className="px-2 py-1 border rounded text-sm">
                      <option>Website Updates</option>
                      <option>Blog Posts</option>
                      <option>Product Launches</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sitemap Tab */}
        <TabsContent value="sitemap" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Sitemap Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  XML Sitemap
                </CardTitle>
                <CardDescription>
                  Manage your website's sitemap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Status</div>
                    <div className="text-sm text-muted-foreground">
                      {sitemapStatus.generated ? 'Generated' : 'Not Generated'}
                    </div>
                  </div>
                  <Badge variant={sitemapStatus.generated ? "default" : "secondary"}>
                    {sitemapStatus.generated ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pages</span>
                    <span className="font-medium">{sitemapStatus.pages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total URLs</span>
                    <span className="font-medium">{sitemapStatus.urls}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span className="font-medium">
                      {new Date(sitemapStatus.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={generateSitemap} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sitemap URLs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Sitemap URLs
                </CardTitle>
                <CardDescription>
                  URLs included in your sitemap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    { url: '/', priority: '1.0', changefreq: 'daily' },
                    { url: '/about', priority: '0.8', changefreq: 'monthly' },
                    { url: '/services', priority: '0.9', changefreq: 'weekly' },
                    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
                    { url: '/blog', priority: '0.8', changefreq: 'weekly' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.url}</div>
                        <div className="text-xs text-muted-foreground">
                          Priority: {item.priority} • Frequency: {item.changefreq}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* AI SEO Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI SEO Assistant
                </CardTitle>
                <CardDescription>
                  Get AI-powered SEO recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-sm text-green-900">Content Optimization</div>
                    <div className="text-xs text-green-800 mt-1">
                      Add more internal links to improve page authority
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900">Technical SEO</div>
                    <div className="text-xs text-blue-800 mt-1">
                      Optimize images to reduce page load time by 2.3s
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-sm text-purple-900">User Experience</div>
                    <div className="text-xs text-purple-800 mt-1">
                      Improve mobile responsiveness for better rankings
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate AI Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analytics Insights
                </CardTitle>
                <CardDescription>
                  AI-driven analytics recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Traffic Growth Opportunity</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Optimize for "website builder pakistan" to increase traffic by 25%
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Conversion Optimization</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Add testimonials to increase conversion rate by 15%
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Content Strategy</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Create blog posts about "Pakistani web design trends"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Create Social Media Post
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreatePostModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Schedule a new post for your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Post Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's on your mind?"
                  className="mt-1"
                  rows={4}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {newPost.content.length}/280 characters
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledAt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Image URL (Optional)</label>
                <Input
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreatePostModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={createNewPost}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Settings Modal */}
      {showPlatformSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {showPlatformSettings.charAt(0).toUpperCase() + showPlatformSettings.slice(1)} Settings
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPlatformSettings(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Connect and configure your {showPlatformSettings} account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  {showPlatformSettings === 'facebook' && <Facebook className="h-8 w-8 text-blue-600" />}
                  {showPlatformSettings === 'twitter' && <Twitter className="h-8 w-8 text-blue-400" />}
                  {showPlatformSettings === 'instagram' && <Instagram className="h-8 w-8 text-pink-600" />}
                  {showPlatformSettings === 'linkedin' && <Share className="h-8 w-8 text-blue-700" />}
                </div>
                <h3 className="font-medium mb-2">Connect Your {showPlatformSettings.charAt(0).toUpperCase() + showPlatformSettings.slice(1)} Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Authorize access to post content and manage your social media presence
                </p>
                <Button 
                  onClick={() => connectPlatform(showPlatformSettings)}
                  className="w-full"
                >
                  Connect Account
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-posting</span>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Post frequency</span>
                  <select className="px-2 py-1 border rounded text-sm">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Content approval</span>
                  <Button variant="outline" size="sm">
                    Required
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
