"use client";
import React from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Link } from '../lib/router'
import { formatPKR } from '../lib/utils'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { 
  Palette, 
  Smartphone, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  Globe,
  CreditCard,
  Check,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Award
} from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Drag & Drop Builder',
    description: 'Create beautiful websites with our intuitive drag and drop interface. No coding required.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'All websites are automatically optimized for mobile devices and tablets.',
  },
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Let AI help you create content, optimize SEO, and design your perfect website.',
  },
  {
    icon: Shield,
    title: 'Secure & Fast',
    description: 'Built-in security features and optimized for lightning-fast loading speeds.',
  },
  {
    icon: Globe,
    title: 'Urdu Support',
    description: 'Full support for Urdu language with RTL text direction for Pakistani audience.',
  },
  {
    icon: CreditCard,
    title: 'Local Payments',
    description: 'Integrated with JazzCash, EasyPaisa, and other Pakistani payment methods.',
  }
]

const templates = [
  {
    id: '1',
    name: 'Modern Business',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
    isPremium: false
  },
  {
    id: '2',
    name: 'E-commerce Store',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
    isPremium: true
  },
  {
    id: '3',
    name: 'Restaurant Menu',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop',
    isPremium: false
  }
]

const pricing = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      '3 websites',
      'Basic templates',
      'Mobile responsive',
      'SSL certificate',
      'Community support'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: 2499,
    description: 'Best for growing businesses',
    features: [
      'Unlimited websites',
      'Premium templates',
      'AI assistant',
      'Custom domain',
      'E-commerce features',
      'Analytics dashboard',
      'Priority support',
      'Remove WebBuilder branding'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 9999,
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'White-label solution',
      'Team collaboration',
      'Advanced integrations',
      'Custom development',
      'Dedicated support',
      'SLA guarantee'
    ],
    popular: false
  }
]

const testimonials = [
  {
    name: 'Ahmad Hassan',
    business: 'Hassan Electronics, Karachi',
    content: 'WebBuilder helped me create a professional website for my electronics store in just one day. Sales increased by 40% in the first month!',
    rating: 5
  },
  {
    name: 'Fatima Sheikh',
    business: 'Elegant Boutique, Lahore',
    content: 'The Urdu support and mobile responsiveness are excellent. My customers love browsing my fashion collection on their phones.',
    rating: 5
  },
  {
    name: 'Muhammad Ali',
    business: 'Tech Solutions Pvt Ltd, Islamabad',
    content: 'As a tech company, we needed something modern and fast. WebBuilder delivered exactly what we needed with great performance.',
    rating: 5
  }
]

const stats = [
  { number: '50,000+', label: 'Websites Created' },
  { number: '25,000+', label: 'Happy Customers' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' }
]

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="landing" />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              🇵🇰 Made for Pakistani Businesses
            </Badge>
            <h1 className="mb-8 text-4xl lg:text-6xl font-semibold tracking-tight leading-tight">
              Build Stunning Websites for Your{' '}
              <span className="text-primary">Pakistani Business</span>
            </h1>
            <p className="mb-10 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create professional websites in minutes with our AI-powered builder. 
              Built specifically for Pakistani businesses with Urdu support, local payments, 
              and mobile-first design.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever plan available • 14-day money-back guarantee
            </p>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-semibold text-foreground">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Features
            </Badge>
            <h2 className="mb-6 text-3xl lg:text-4xl font-semibold">
              Everything You Need to Succeed Online
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Powerful features designed specifically for Pakistani businesses to grow and thrive in the digital world
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Palette className="mr-2 h-4 w-4" />
              Templates
            </Badge>
            <h2 className="mb-6 text-3xl lg:text-4xl font-semibold">
              Beautiful Templates for Every Business
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose from hundreds of professionally designed templates, optimized for Pakistani businesses
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={template.image}
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {template.isPremium && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      <Award className="mr-1 h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-base mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/dashboard/templates">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View All Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <CreditCard className="mr-2 h-4 w-4" />
              Pricing
            </Badge>
            <h2 className="mb-6 text-3xl lg:text-4xl font-semibold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose the perfect plan for your business needs. Start free, upgrade anytime.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm'} transition-shadow duration-200 hover:shadow-md`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-medium">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-semibold text-foreground">
                      {plan.price === 0 ? 'Free' : formatPKR(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="block">
                    <Button 
                      className="w-full py-2"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price === 0 ? 'Start Free' : 'Choose Plan'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Users className="mr-2 h-4 w-4" />
              Testimonials
            </Badge>
            <h2 className="mb-6 text-3xl lg:text-4xl font-semibold">
              Trusted by Pakistani Businesses
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              See what our customers are saying about WebBuilder and how it's transformed their business
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.business}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl lg:text-4xl font-semibold">
            Ready to Build Your Dream Website?
          </h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Pakistani businesses already using WebBuilder to grow their online presence
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-3">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3">
                Try AI Builder
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">W</span>
                </div>
                <span className="font-semibold text-lg">WebBuilder</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                The easiest way to create professional websites for Pakistani businesses.
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  <Users className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#templates" className="hover:text-primary transition-colors">Templates</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-12 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 WebBuilder. Made with ❤️ for Pakistan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage