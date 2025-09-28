'use client'

import { Element } from '@/types/editor'
import { TrendingUp, Users, Trophy, Coffee } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function StatsElement({ element, isSelected, onSelect }: StatsElementProps) {
  const { stats = [], animate = true, layout = 'grid' } = element.props
  const [counters, setCounters] = useState<number[]>([])

  const defaultStats = stats.length > 0 ? stats : [
    { value: 500, suffix: '+', label: 'Happy Clients', icon: 'users' },
    { value: 98, suffix: '%', label: 'Success Rate', icon: 'trending-up' },
    { value: 150, suffix: '+', label: 'Projects Completed', icon: 'trophy' },
    { value: 24, suffix: '/7', label: 'Support', icon: 'coffee' },
  ]

  const icons: Record<string, any> = {
    'users': Users,
    'trending-up': TrendingUp,
    'trophy': Trophy,
    'coffee': Coffee,
  }

  useEffect(() => {
    if (animate) {
      // Initialize counters to 0
      setCounters(new Array(defaultStats.length).fill(0))
      
      // Animate each counter
      defaultStats.forEach((stat, index) => {
        const duration = 2000 // 2 seconds
        const steps = 50
        const increment = stat.value / steps
        let current = 0
        
        const timer = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            current = stat.value
            clearInterval(timer)
          }
          setCounters(prev => {
            const newCounters = [...prev]
            newCounters[index] = Math.floor(current)
            return newCounters
          })
        }, duration / steps)
        
        return () => clearInterval(timer)
      })
    } else {
      setCounters(defaultStats.map(stat => stat.value))
    }
  }, [animate])

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className={`
        grid gap-8
        ${layout === 'grid' 
          ? 'grid-cols-2 md:grid-cols-4' 
          : 'grid-cols-1'
        }
      `}>
        {defaultStats.map((stat, index) => {
          const Icon = icons[stat.icon] || TrendingUp
          const displayValue = animate ? counters[index] || 0 : stat.value
          
          return (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="mb-4 inline-flex">
                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">
                {displayValue}
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
