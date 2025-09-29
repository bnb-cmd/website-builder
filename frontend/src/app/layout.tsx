import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ProgressiveEnhancer } from '@/components/ui/progressive-enhancer'
import { SkipLinks } from '@/components/ui/skip-links'
import { AccessibilitySettings } from '@/components/ui/accessibility-settings'
import { I18nProvider } from '@/components/ui/i18n-provider'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { GestureProvider } from '@/components/ui/gesture-manager'
import { PWAInitializer } from '@/components/ui/pwa-initializer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pakistan Website Builder - Create Beautiful Websites',
  description: 'Pakistan\'s most advanced AI-powered website builder. Create stunning websites for your business with our drag-and-drop editor, AI content generation, and Pakistan-specific features.',
  keywords: [
    'website builder',
    'Pakistan',
    'AI',
    'drag and drop',
    'website design',
    'business website',
    'e-commerce',
    'Urdu support',
    'JazzCash',
    'EasyPaisa'
  ],
  authors: [{ name: 'Pakistan Website Builder Team' }],
  creator: 'Pakistan Website Builder',
  publisher: 'Pakistan Website Builder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ur-PK': '/ur',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Pakistan Website Builder - Create Beautiful Websites',
    description: 'Pakistan\'s most advanced AI-powered website builder. Create stunning websites for your business with our drag-and-drop editor, AI content generation, and Pakistan-specific features.',
    siteName: 'Pakistan Website Builder',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pakistan Website Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Website Builder - Create Beautiful Websites',
    description: 'Pakistan\'s most advanced AI-powered website builder. Create stunning websites for your business with our drag-and-drop editor, AI content generation, and Pakistan-specific features.',
    images: ['/og-image.jpg'],
    creator: '@pakistanbuilder',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <I18nProvider defaultLanguage="en">
            <GestureProvider>
              {/* PWA Initialization */}
              <PWAInitializer />

              {/* Skip Links for Accessibility */}
              <SkipLinks />

              <ProgressiveEnhancer>
                {children}

                {/* Language Switcher */}
                <div className="fixed top-4 right-4 z-40">
                  <LanguageSwitcher variant="minimal" />
                </div>

                {/* Accessibility Settings Panel */}
                <div className="fixed bottom-4 right-4 z-40">
                  <AccessibilitySettings compact />
                </div>
              </ProgressiveEnhancer>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </GestureProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}