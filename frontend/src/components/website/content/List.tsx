import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const ListConfig: ComponentConfig = {
  id: 'list',
  name: 'List',
  category: 'content',
  icon: 'List',
  description: 'Create bulleted lists',
  defaultProps: {},
  defaultSize: { width: 250, height: 150 },
  editableFields: []
}

interface ListProps extends WebsiteComponentProps {}

export const List: React.FC<ListProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <ul className={`list-disc list-inside w-full h-full ${padding} ${textSize}`}>
      <li>List Item 1</li>
      <li>List Item 2</li>
      <li>List Item 3</li>
    </ul>
  )
}
