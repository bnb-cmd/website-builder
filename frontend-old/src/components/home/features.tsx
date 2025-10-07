'use client'

import { Palette, Zap, Globe, Shield, Smartphone, Headphones } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'AI-Powered Design',
    description: 'Generate beautiful designs and content with our advanced AI technology. Create professional websites in minutes, not hours.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Build and deploy websites with our optimized infrastructure. Your site loads in under 2 seconds globally.'
  },
  {
    icon: Globe,
    title: 'Pakistan-First',
    description: 'Built specifically for Pakistani businesses with Urdu support, local payment gateways, and cultural templates.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee. Your data is safe with us.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First',
    description: 'All websites are automatically optimized for mobile devices. Perfect experience on any screen size.'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Get help when you need it with our dedicated support team. Available in Urdu and English.'
  }
]

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need to build amazing websites
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and features you need to create, 
            manage, and grow your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
