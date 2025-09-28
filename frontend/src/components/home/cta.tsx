'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary-foreground/20 px-4 py-2 text-sm font-medium bg-primary-foreground/10">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Building Today
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Build Your Dream Website?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of Pakistani businesses who trust Pakistan Builder to create 
              their online presence. Start free, upgrade when you're ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/60"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/60"></div>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/60"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
