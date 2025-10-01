'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Star, Users, Globe, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="container py-24 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/20 px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
                <Star className="h-3 w-3 mr-1 fill-primary" />
                Pakistan's #1 Website Builder
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in-up">
                Create Beautiful Websites with{' '}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient-x">AI Power</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
                Build stunning websites for your Pakistani business with our drag-and-drop editor, 
                AI content generation, and local payment integrations. No coding required.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 animate-fade-in-up animation-delay-300">
              <div className="text-center group">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">10K+</div>
                <div className="text-sm text-muted-foreground">Websites Created</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">500+</div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 group">
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Trusted by 10,000+ businesses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Available in Urdu & English</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-fade-in-up animation-delay-500">
            <div className="relative z-10">
              {/* Mock Website Preview */}
              <div className="bg-white dark:bg-card rounded-xl shadow-2xl border border-border/50 overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-20 bg-gray-200 rounded"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-lg shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
    </section>
  )
}
