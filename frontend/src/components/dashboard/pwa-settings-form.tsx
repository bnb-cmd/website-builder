'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { apiHelpers } from '@/lib/api'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const pwaSettingsSchema = z.object({
  name: z.string().min(1, 'App name is required').max(100),
  shortName: z.string().min(1, 'Short name is required').max(50),
  description: z.string().max(500).optional(),
  themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format').optional(),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format').optional(),
  display: z.enum(['standalone', 'fullscreen', 'minimal-ui']).optional(),
  orientation: z.enum(['portrait', 'landscape']).optional(),
  startUrl: z.string().optional(),
  icon512: z.string().url('Must be a valid URL').optional(),
  icon192: z.string().url('Must be a valid URL').optional(),
})

type PwaSettingsFormValues = z.infer<typeof pwaSettingsSchema>

interface PwaSettingsFormProps {
  websiteId: string
}

export function PwaSettingsForm({ websiteId }: PwaSettingsFormProps) {
  const form = useForm<PwaSettingsFormValues>({
    resolver: zodResolver(pwaSettingsSchema),
    defaultValues: {
      display: 'standalone',
      orientation: 'portrait',
      startUrl: '/',
      themeColor: '#ffffff',
      backgroundColor: '#ffffff',
    },
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await apiHelpers.getPwaSettings(websiteId)
        if (response.data.data) {
          form.reset(response.data.data)
        }
      } catch (error) {
        // It's okay if settings don't exist yet
      }
    }
    fetchSettings()
  }, [websiteId, form])

  async function onSubmit(data: PwaSettingsFormValues) {
    const toastId = toast.loading('Saving PWA settings...')
    try {
      await apiHelpers.updatePwaSettings(websiteId, data)
      toast.success('PWA settings saved successfully!', { id: toastId })
    } catch (error) {
      toast.error('Failed to save PWA settings.', { id: toastId })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Awesome App" {...field} />
                </FormControl>
                <FormDescription>The full name of your web application.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Name</FormLabel>
                <FormControl>
                  <Input placeholder="Awesome App" {...field} />
                </FormControl>
                <FormDescription>A short version of the name, used on the home screen.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of your app..." {...field} />
              </FormControl>
              <FormDescription>Describe what your app does.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="themeColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormDescription>The primary color of your app.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormDescription>The background color of your app.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="display"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standalone">Standalone</SelectItem>
                    <SelectItem value="fullscreen">Fullscreen</SelectItem>
                    <SelectItem value="minimal-ui">Minimal UI</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How the app appears when launched.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orientation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Preferred screen orientation.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="startUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start URL</FormLabel>
              <FormControl>
                <Input placeholder="/" {...field} />
              </FormControl>
              <FormDescription>The URL to load when the app starts.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="icon192"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon 192x192</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/icon-192.png" {...field} />
                </FormControl>
                <FormDescription>URL to 192x192 icon image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon512"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon 512x512</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/icon-512.png" {...field} />
                </FormControl>
                <FormDescription>URL to 512x512 icon image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  )
}
