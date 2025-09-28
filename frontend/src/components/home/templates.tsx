'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Eye } from 'lucide-react'

const templates = [
  {
    id: 'restaurant-1',
    name: 'Restaurant Deluxe',
    description: 'Perfect for restaurants, cafes, and food businesses',
    category: 'Restaurant',
    image: '/templates/restaurant-deluxe.jpg',
    isPremium: true,
    price: 2500,
    rating: 4.9,
    downloads: 1250
  },
  {
    id: 'business-1',
    name: 'Modern Business',
    description: 'Clean and professional template for business websites',
    category: 'Business',
    image: '/templates/modern-business.jpg',
    isPremium: false,
    price: 0,
    rating: 4.8,
    downloads: 2100
  },
  {
    id: 'ecommerce-1',
    name: 'E-commerce Pro',
    description: 'Complete online store template with shopping cart',
    category: 'E-commerce',
    image: '/templates/ecommerce-pro.jpg',
    isPremium: true,
    price: 3500,
    rating: 4.9,
    downloads: 890
  },
  {
    id: 'portfolio-1',
    name: 'Creative Portfolio',
    description: 'Showcase your work with this stunning portfolio template',
    category: 'Portfolio',
    image: '/templates/creative-portfolio.jpg',
    isPremium: false,
    price: 0,
    rating: 4.7,
    downloads: 1650
  },
  {
    id: 'healthcare-1',
    name: 'Medical Center',
    description: 'Professional template for healthcare providers',
    category: 'Healthcare',
    image: '/templates/medical-center.jpg',
    isPremium: true,
    price: 3000,
    rating: 4.8,
    downloads: 720
  },
  {
    id: 'education-1',
    name: 'School Website',
    description: 'Complete template for educational institutions',
    category: 'Education',
    image: '/templates/school-website.jpg',
    isPremium: false,
    price: 0,
    rating: 4.6,
    downloads: 980
  }
]

export function Templates() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Beautiful Templates for Every Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from hundreds of professionally designed templates. 
            All templates are mobile-responsive and optimized for Pakistani businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Eye className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                {template.isPremium && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    Premium
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{template.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({template.downloads} downloads)
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    {template.price === 0 ? 'Free' : `PKR ${template.price}`}
                  </div>
                </div>
                
                <Button className="w-full group-hover:bg-primary/90">
                  Use Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/templates">
            <Button variant="outline" size="lg">
              View All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
