'use client'

import * as React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

const baseProps: IconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.5,
  stroke: 'currentColor',
}

const withProps = (props?: IconProps) => ({
  ...baseProps,
  ...props,
})

export const FormIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg ref={ref} {...withProps(props)}>
    <rect x="4" y="3" width="16" height="18" rx="2.5" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </svg>
))
FormIcon.displayName = 'FormIcon'

export const GalleryIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg ref={ref} {...withProps(props)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 15.5l4.5-3 5 4 4-3 4.5 3.5" />
    <circle cx="9" cy="8" r="1.5" />
  </svg>
))
GalleryIcon.displayName = 'GalleryIcon'

export const SliderIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg ref={ref} {...withProps(props)}>
    <line x1="4" y1="8" x2="20" y2="8" />
    <line x1="4" y1="16" x2="20" y2="16" />
    <circle cx="9" cy="8" r="2.5" />
    <circle cx="15" cy="16" r="2.5" />
  </svg>
))
SliderIcon.displayName = 'SliderIcon'

export const TabsIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg ref={ref} {...withProps(props)}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18" />
    <path d="M9 6v4" />
  </svg>
))
TabsIcon.displayName = 'TabsIcon'

export const PentagonIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg ref={ref} {...withProps(props)}>
    <path d="M12 3l8 3-2.5 9-11 0L4 6z" />
  </svg>
))
PentagonIcon.displayName = 'PentagonIcon'

export const CubeIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg ref={ref} {...withProps(props)}>
    <path d="M12 3l7 4v8l-7 4-7-4V7l7-4z" />
    <path d="M12 11l7-4" />
    <path d="M12 11l-7-4" />
    <path d="M12 11v8" />
  </svg>
))
CubeIcon.displayName = 'CubeIcon'

export const CustomIcons = {
  FormIcon,
  GalleryIcon,
  SliderIcon,
  TabsIcon,
  PentagonIcon,
  CubeIcon,
}


