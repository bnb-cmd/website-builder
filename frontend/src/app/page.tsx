import { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { Templates } from '@/components/home/templates'
import { Pricing } from '@/components/home/pricing'
import { Testimonials } from '@/components/home/testimonials'
import { FAQ } from '@/components/home/faq'
import { CTA } from '@/components/home/cta'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Pakistan Website Builder - Create Beautiful Websites',
  description: 'Pakistan\'s most advanced AI-powered website builder. Create stunning websites for your business with our drag-and-drop editor, AI content generation, and Pakistan-specific features.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Templates />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
