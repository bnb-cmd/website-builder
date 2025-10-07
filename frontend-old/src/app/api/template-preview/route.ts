import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('id')
  const category = searchParams.get('category') || 'business'
  const name = searchParams.get('name') || 'Template'
  
  // Create a simple SVG template preview
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${getCategoryColor(category, 'light')};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${getCategoryColor(category, 'dark')};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="300" fill="url(#bg)"/>
      
      <!-- Header -->
      <rect x="20" y="20" width="360" height="40" rx="8" fill="${getCategoryColor(category, 'medium')}" opacity="0.8"/>
      <rect x="30" y="30" width="120" height="20" rx="4" fill="white" opacity="0.9"/>
      
      <!-- Content blocks -->
      <rect x="20" y="80" width="360" height="20" rx="4" fill="white" opacity="0.7"/>
      <rect x="20" y="110" width="280" height="20" rx="4" fill="white" opacity="0.6"/>
      <rect x="20" y="140" width="200" height="20" rx="4" fill="white" opacity="0.5"/>
      
      <!-- Main content area -->
      <rect x="20" y="180" width="360" height="80" rx="8" fill="white" opacity="0.4"/>
      
      <!-- Template name -->
      <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">
        ${name}
      </text>
      
      <!-- Category indicator -->
      <circle cx="370" cy="30" r="8" fill="${getCategoryColor(category, 'accent')}"/>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}

function getCategoryColor(category: string, shade: 'light' | 'medium' | 'dark' | 'accent') {
  const colors: { [key: string]: { [key: string]: string } } = {
    'business': {
      light: '#dbeafe',
      medium: '#3b82f6',
      dark: '#1e40af',
      accent: '#1d4ed8'
    },
    'ecommerce': {
      light: '#dcfce7',
      medium: '#22c55e',
      dark: '#15803d',
      accent: '#16a34a'
    },
    'restaurant': {
      light: '#fed7aa',
      medium: '#f97316',
      dark: '#c2410c',
      accent: '#ea580c'
    },
    'portfolio': {
      light: '#f3e8ff',
      medium: '#a855f7',
      dark: '#7c3aed',
      accent: '#9333ea'
    },
    'education': {
      light: '#fef3c7',
      medium: '#f59e0b',
      dark: '#d97706',
      accent: '#ca8a04'
    },
    'medical': {
      light: '#ccfbf1',
      medium: '#14b8a6',
      dark: '#0f766e',
      accent: '#0d9488'
    },
    'default': {
      light: '#f1f5f9',
      medium: '#64748b',
      dark: '#334155',
      accent: '#475569'
    }
  }
  
  const categoryKey = category.toLowerCase()
  return colors[categoryKey]?.[shade] || colors.default[shade]
}
