'use client'

import React, { useState } from 'react'
import { useAccessibility } from '@/hooks/use-accessibility'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Eye,
  Volume2,
  MousePointer,
  Contrast,
  Type,
  Settings,
  Monitor,
  Smartphone,
  Zap,
  CheckCircle
} from 'lucide-react'

interface AccessibilitySettingsProps {
  className?: string
  compact?: boolean
}

export function AccessibilitySettings({ className, compact = false }: AccessibilitySettingsProps) {
  const { settings, updateSettings, isInitialized } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  if (!isInitialized) return null

  if (compact) {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>Accessibility</span>
        </Button>

        {isOpen && (
          <Card className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex items-center space-x-2">
                  <Contrast className="h-4 w-4" />
                  <span>High Contrast</span>
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span>Large Text</span>
                </Label>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSettings({ largeText: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Reduced Motion</span>
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="skip-links" className="flex items-center space-x-2">
                  <MousePointer className="h-4 w-4" />
                  <span>Skip Links</span>
                </Label>
                <Switch
                  id="skip-links"
                  checked={settings.skipLinks}
                  onCheckedChange={(checked) => updateSettings({ skipLinks: checked })}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Accessibility Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  Display
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="flex items-center space-x-2">
                      <Contrast className="h-4 w-4" />
                      <span>High Contrast</span>
                    </Label>
                    <Switch
                      id="high-contrast"
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="large-text" className="flex items-center space-x-2">
                      <Type className="h-4 w-4" />
                      <span>Large Text</span>
                    </Label>
                    <Switch
                      id="large-text"
                      checked={settings.largeText}
                      onCheckedChange={(checked) => updateSettings({ largeText: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduced-motion" className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Reduced Motion</span>
                    </Label>
                    <Switch
                      id="reduced-motion"
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Interaction
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="keyboard-nav" className="flex items-center space-x-2">
                      <MousePointer className="h-4 w-4" />
                      <span>Keyboard Navigation</span>
                    </Label>
                    <Switch
                      id="keyboard-nav"
                      checked={settings.keyboardNavigation}
                      onCheckedChange={(checked) => updateSettings({ keyboardNavigation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="focus-visible" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Focus Indicators</span>
                    </Label>
                    <Switch
                      id="focus-visible"
                      checked={settings.focusVisible}
                      onCheckedChange={(checked) => updateSettings({ focusVisible: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="skip-links" className="flex items-center space-x-2">
                      <MousePointer className="h-4 w-4" />
                      <span>Skip Links</span>
                    </Label>
                    <Switch
                      id="skip-links"
                      checked={settings.skipLinks}
                      onCheckedChange={(checked) => updateSettings({ skipLinks: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Navigation Preferences</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-shortcuts" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Keyboard Shortcuts</span>
                  </Label>
                  <Switch
                    id="keyboard-shortcuts"
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSettings({ keyboardNavigation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="tab-navigation" className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4" />
                    <span>Tab Navigation</span>
                  </Label>
                  <Switch
                    id="tab-navigation"
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSettings({ keyboardNavigation: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Content Preferences</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader" className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <span>Screen Reader Support</span>
                  </Label>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => updateSettings({ screenReader: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="announcements" className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <span>ARIA Announcements</span>
                  </Label>
                  <Switch
                    id="announcements"
                    checked={settings.announcements}
                    onCheckedChange={(checked) => updateSettings({ announcements: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Feedback & Support</h3>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Accessibility Features Active</p>
                    <p className="text-xs text-muted-foreground">
                      Your accessibility preferences are being applied throughout the application.
                      Changes take effect immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Use Tab to navigate through interactive elements</p>
                <p>• Press Escape to close modals and menus</p>
                <p>• Use arrow keys in forms and lists</p>
                <p>• Screen reader announcements are enabled</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
