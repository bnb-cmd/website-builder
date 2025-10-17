'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones, Instagram, Facebook, Twitter, Linkedin, Youtube, TikTok, Pinterest, Snapchat, Search, Filter, SortAsc, SortDesc, Award, Trophy, Medal, Target, TrendingUp, BarChart3, PieChart, Activity, Users, Eye, Download, ExternalLink, Zap, Rocket, Shield as ShieldIcon, Crown, Diamond, Bell, Settings, UserPlus, Mail as MailIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NotificationCenterProps {
  notifications: Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error' | 'promotion'
    timestamp: string
    read: boolean
    actionUrl?: string
    actionText?: string
    avatar?: string
    icon?: string
  }>
  onMarkAsRead?: (notificationId: string) => void
  onMarkAllAsRead?: () => void
  onDelete?: (notificationId: string) => void
  onAction?: (notificationId: string, actionUrl: string) => void
  showTimestamp?: boolean
  showActions?: boolean
  showMarkAll?: boolean
  showDelete?: boolean
  maxNotifications?: number
  layout?: 'dropdown' | 'sidebar' | 'modal' | 'inline'
  theme?: 'light' | 'dark' | 'colored'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [
    {
      id: '1',
      title: 'New Message',
      message: 'You have received a new message from Sarah Johnson',
      type: 'info',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      actionUrl: '/messages',
      actionText: 'View Message',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      icon: 'message-square'
    },
    {
      id: '2',
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed and is being processed',
      type: 'success',
      timestamp: '2024-01-15T09:15:00Z',
      read: false,
      actionUrl: '/orders/12345',
      actionText: 'Track Order',
      icon: 'check-circle'
    },
    {
      id: '3',
      title: 'Payment Due',
      message: 'Your subscription payment is due in 3 days',
      type: 'warning',
      timestamp: '2024-01-15T08:00:00Z',
      read: true,
      actionUrl: '/billing',
      actionText: 'Pay Now',
      icon: 'credit-card'
    },
    {
      id: '4',
      title: 'Special Offer',
      message: 'Get 50% off on all premium features this month!',
      type: 'promotion',
      timestamp: '2024-01-14T15:30:00Z',
      read: true,
      actionUrl: '/offers',
      actionText: 'Claim Offer',
      icon: 'gift'
    }
  ],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onAction,
  showTimestamp = true,
  showActions = true,
  showMarkAll = true,
  showDelete = true,
  maxNotifications = 10,
  layout = 'dropdown',
  theme = 'light',
  position = 'top-right'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter(n => !n.read).length
  )

  const handleMarkAsRead = (notificationId: string) => {
    setUnreadCount(prev => Math.max(0, prev - 1))
    onMarkAsRead?.(notificationId)
  }

  const handleMarkAllAsRead = () => {
    setUnreadCount(0)
    onMarkAllAsRead?.()
  }

  const handleDelete = (notificationId: string) => {
    onDelete?.(notificationId)
  }

  const handleAction = (notificationId: string, actionUrl: string) => {
    onAction?.(notificationId, actionUrl)
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          dot: 'bg-green-500'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          dot: 'bg-yellow-500'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          dot: 'bg-red-500'
        }
      case 'promotion':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: 'text-purple-600',
          dot: 'bg-purple-500'
        }
      default: // info
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          dot: 'bg-blue-500'
        }
    }
  }

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'message-square': MessageSquare,
      'check-circle': CheckCircle,
      'credit-card': CreditCard,
      'gift': Star,
      'bell': Bell,
      'user-plus': UserPlus,
      'mail': MailIcon,
      'settings': Settings
    }
    
    const IconComponent = iconMap[iconName.toLowerCase()]
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Bell className="w-4 h-4" />
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const containerClass = cn(
    'rounded-lg border shadow-lg',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const textClass = cn(
    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
  )

  const secondaryTextClass = cn(
    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  )

  const displayedNotifications = notifications.slice(0, maxNotifications)

  if (layout === 'sidebar') {
    return (
      <div className={cn(containerClass, 'w-80 h-full')}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className={cn('font-semibold', textClass)}>Notifications</h3>
            {showMarkAll && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {displayedNotifications.map((notification) => {
            const typeStyles = getTypeStyles(notification.type)
            
            return (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b border-gray-200 hover:bg-gray-50 transition',
                  !notification.read && 'bg-blue-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-full', typeStyles.bg)}>
                    {notification.avatar ? (
                      <img
                        src={notification.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className={cn(typeStyles.icon)}>
                        {getIcon(notification.icon || 'bell')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={cn('font-medium text-sm', textClass)}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className={cn('w-2 h-2 rounded-full', typeStyles.dot)} />
                      )}
                    </div>
                    
                    <p className={cn('text-sm mt-1', secondaryTextClass)}>
                      {notification.message}
                    </p>
                    
                    {showTimestamp && (
                      <p className={cn('text-xs mt-2', secondaryTextClass)}>
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    )}
                    
                    {showActions && notification.actionUrl && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(notification.id, notification.actionUrl!)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {notification.actionText || 'View'}
                        </button>
                        
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Mark as read
                          </button>
                        )}
                        
                        {showDelete && (
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (layout === 'modal') {
    return (
      <div className={cn(containerClass, 'w-96 max-h-96')}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className={cn('font-semibold', textClass)}>Notifications</h3>
            {showMarkAll && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {displayedNotifications.map((notification) => {
            const typeStyles = getTypeStyles(notification.type)
            
            return (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b border-gray-200 hover:bg-gray-50 transition',
                  !notification.read && 'bg-blue-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-full', typeStyles.bg)}>
                    {notification.avatar ? (
                      <img
                        src={notification.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className={cn(typeStyles.icon)}>
                        {getIcon(notification.icon || 'bell')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={cn('font-medium text-sm', textClass)}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className={cn('w-2 h-2 rounded-full', typeStyles.dot)} />
                      )}
                    </div>
                    
                    <p className={cn('text-sm mt-1', secondaryTextClass)}>
                      {notification.message}
                    </p>
                    
                    {showTimestamp && (
                      <p className={cn('text-xs mt-2', secondaryTextClass)}>
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    )}
                    
                    {showActions && notification.actionUrl && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(notification.id, notification.actionUrl!)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {notification.actionText || 'View'}
                        </button>
                        
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Mark as read
                          </button>
                        )}
                        
                        {showDelete && (
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (layout === 'inline') {
    return (
      <div className={containerClass}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('font-semibold', textClass)}>Notifications</h3>
            {showMarkAll && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {displayedNotifications.map((notification) => {
              const typeStyles = getTypeStyles(notification.type)
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'p-3 rounded-lg border transition',
                    typeStyles.bg,
                    typeStyles.border,
                    !notification.read && 'ring-2 ring-blue-200'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-full', typeStyles.bg)}>
                      {notification.avatar ? (
                        <img
                          src={notification.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className={cn(typeStyles.icon)}>
                          {getIcon(notification.icon || 'bell')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={cn('font-medium text-sm', textClass)}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className={cn('w-2 h-2 rounded-full', typeStyles.dot)} />
                        )}
                      </div>
                      
                      <p className={cn('text-sm mt-1', secondaryTextClass)}>
                        {notification.message}
                      </p>
                      
                      {showTimestamp && (
                        <p className={cn('text-xs mt-2', secondaryTextClass)}>
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      )}
                      
                      {showActions && notification.actionUrl && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAction(notification.id, notification.actionUrl!)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {notification.actionText || 'View'}
                          </button>
                          
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Mark as read
                            </button>
                          )}
                          
                          {showDelete && (
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-sm text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Dropdown layout (default)
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className={cn(
          'absolute z-50 mt-2 w-80',
          position === 'top-right' ? 'right-0' : 'left-0'
        )}>
          <div className={containerClass}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className={cn('font-semibold', textClass)}>Notifications</h3>
                {showMarkAll && unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {displayedNotifications.map((notification) => {
                const typeStyles = getTypeStyles(notification.type)
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border-b border-gray-200 hover:bg-gray-50 transition',
                      !notification.read && 'bg-blue-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('p-2 rounded-full', typeStyles.bg)}>
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className={cn(typeStyles.icon)}>
                            {getIcon(notification.icon || 'bell')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={cn('font-medium text-sm', textClass)}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className={cn('w-2 h-2 rounded-full', typeStyles.dot)} />
                          )}
                        </div>
                        
                        <p className={cn('text-sm mt-1', secondaryTextClass)}>
                          {notification.message}
                        </p>
                        
                        {showTimestamp && (
                          <p className={cn('text-xs mt-2', secondaryTextClass)}>
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        )}
                        
                        {showActions && notification.actionUrl && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleAction(notification.id, notification.actionUrl!)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {notification.actionText || 'View'}
                            </button>
                            
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                              >
                                Mark as read
                              </button>
                            )}
                            
                            {showDelete && (
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-sm text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const NotificationCenterConfig = {
  id: 'notification-center',
  name: 'Notification Center',
  description: 'Notification center with different types, actions, and multiple layouts',
  category: 'content' as const,
  icon: 'bell',
  defaultProps: {
    notifications: [
      {
        id: '1',
        title: 'New Message',
        message: 'You have received a new message from Sarah Johnson',
        type: 'info',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        actionUrl: '/messages',
        actionText: 'View Message',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        icon: 'message-square'
      }
    ],
    showTimestamp: true,
    showActions: true,
    showMarkAll: true,
    showDelete: true,
    maxNotifications: 10,
    layout: 'dropdown',
    theme: 'light',
    position: 'top-right'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'notifications',
    'onMarkAsRead',
    'onMarkAllAsRead',
    'onDelete',
    'onAction',
    'showTimestamp',
    'showActions',
    'showMarkAll',
    'showDelete',
    'maxNotifications',
    'layout',
    'theme',
    'position'
  ]
}
