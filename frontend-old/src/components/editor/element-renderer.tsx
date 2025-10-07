'use client'

import { useState } from 'react'
import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Trash2, Copy, Move, Settings, Eye, EyeOff } from 'lucide-react'

// Element Components
import { TextElement } from './elements/text-element'
import { HeadingElement } from './elements/heading-element'
import { ImageElement } from './elements/image-element'
import { ButtonElement } from './elements/button-element'
import { ContainerElement } from './elements/container-element'
import { FormElement } from './elements/form-element'
import { VideoElement } from './elements/video-element'
import { DividerElement } from './elements/divider-element'
import { SpacerElement } from './elements/spacer-element'
import { HeroElement } from './elements/hero-element'
import { FeaturesElement } from './elements/features-element'
import { CTAElement } from './elements/cta-element'
import { TimelineElement } from './elements/timeline-element'
import { StatsElement } from './elements/stats-element'
import { AccordionElement } from './elements/accordion-element'
import { TabsElement } from './elements/tabs-element'
import { ProgressElement } from './elements/progress-element'
import { CountdownElement } from './elements/countdown-element'
import { TestimonialElement } from './elements/testimonial-element'
import { PricingElement } from './elements/pricing-element'
import { TeamElement } from './elements/team-element'
import { FAQElement } from './elements/faq-element'
import { GridElement } from './elements/grid-element'
import { FlexboxElement } from './elements/flexbox-element'
import { SectionElement } from './elements/section-element'
import { ColumnsElement } from './elements/columns-element'
import { CardElement } from './elements/card-element'
import { BadgeElement } from './elements/badge-element'
import { AlertElement } from './elements/alert-element'
import { TooltipElement } from './elements/tooltip-element'
import { SliderElement } from './elements/slider-element'
import { CarouselElement } from './elements/carousel-element'
import { MapElement } from './elements/map-element'
import { ChartElement } from './elements/chart-element'
import { NavbarElement } from './elements/navbar-element'
import { FooterElement } from './elements/footer-element'
import { BreadcrumbElement } from './elements/breadcrumb-element'
import { RatingElement } from './elements/rating-element'
import { SearchElement } from './elements/search-element'
import { GalleryElement } from './elements/gallery-element'
import { NewsletterElement } from './elements/newsletter-element'
import { ContactElement } from './elements/contact-element'
import { SidebarElement } from './elements/sidebar-element'
import { BlogElement } from './elements/blog-element'
import { PortfolioElement } from './elements/portfolio-element'
import { ServicesElement } from './elements/services-element'
import { ClientsElement } from './elements/clients-element'
import { PartnersElement } from './elements/partners-element'
import { AwardsElement } from './elements/awards-element'
import { NotificationElement } from './elements/notification-element'
import { FilterElement } from './elements/filter-element'
import { TableElement } from './elements/table-element'
import { CodeElement } from './elements/code-element'
import { IconElement } from './elements/icon-element'
import { SocialElement } from './elements/social-element'
import { RowElement } from './elements/row-element'
import { AboutElement } from './elements/about-element'
import { BannerElement } from './elements/banner-element'
import { PopupElement } from './elements/popup-element'
import { AudioElement } from './elements/audio-element'
import { PdfElement } from './elements/pdf-element'
import { DownloadElement } from './elements/download-element'
import { PaginationElement } from './elements/pagination-element'
import { CommentsElement } from './elements/comments-element'
import { ShareElement } from './elements/share-element'
import { LoginElement } from './elements/login-element'
import { CartElement } from './elements/cart-element'
import { EmbedElement } from './elements/embed-element'
import { RegisterElement } from './elements/register-element'
import { CheckoutElement } from './elements/checkout-element'
import { WishlistElement } from './elements/wishlist-element'
import { CompareElement } from './elements/compare-element'
import { QuickviewElement } from './elements/quickview-element'

interface ElementRendererProps {
  element: Element
  isSelected: boolean
  onSelect: (elementId: string | null) => void
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  onDelete: (elementId: string) => void
  viewMode: ViewMode
  depth?: number
}

export function ElementRenderer({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  viewMode,
  depth = 0
}: ElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragHovered, setIsDragHovered] = useState(false)

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(element.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(element.id)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    // This would be handled by the parent component
    console.log('Duplicate element:', element.id)
  }

  const getResponsiveStyle = () => {
    if (element.responsive) {
      switch (viewMode) {
        case 'mobile':
          return { ...element.style, ...element.responsive.mobile }
        case 'tablet':
          return { ...element.style, ...element.responsive.tablet }
        case 'desktop':
        default:
          return { ...element.style, ...element.responsive.desktop }
      }
    }
    return element.style
  }

  const renderElement = () => {
    const commonProps = {
      element,
      isSelected,
      onSelect: () => onSelect(element.id),
      onUpdate,
      viewMode,
      style: getResponsiveStyle()
    }

    switch (element.type) {
      case 'text':
        return <TextElement {...commonProps} />
      case 'heading':
        return <HeadingElement {...commonProps} />
      case 'image':
        return <ImageElement {...commonProps} />
      case 'button':
        return <ButtonElement {...commonProps} />
      case 'container':
        return (
          <ContainerElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </ContainerElement>
        )
      case 'form':
        return <FormElement {...commonProps} />
      case 'video':
        return <VideoElement {...commonProps} />
      case 'divider':
        return <DividerElement {...commonProps} />
      case 'spacer':
        return <SpacerElement {...commonProps} />
      case 'hero':
        return <HeroElement {...commonProps} />
      case 'features':
        return <FeaturesElement {...commonProps} />
      case 'cta':
        return <CTAElement {...commonProps} />
      case 'timeline':
        return <TimelineElement {...commonProps} />
      case 'stats':
        return <StatsElement {...commonProps} />
      case 'accordion':
        return <AccordionElement {...commonProps} />
      case 'tabs':
        return <TabsElement {...commonProps} />
      case 'progress':
        return <ProgressElement {...commonProps} />
      case 'countdown':
        return <CountdownElement {...commonProps} />
      case 'testimonial':
        return <TestimonialElement {...commonProps} />
      case 'pricing':
        return <PricingElement {...commonProps} />
      case 'team':
        return <TeamElement {...commonProps} />
      case 'faq':
        return <FAQElement {...commonProps} />
      case 'grid':
        return (
          <GridElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </GridElement>
        )
      case 'flexbox':
      case 'flex':
        return (
          <FlexboxElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </FlexboxElement>
        )
      case 'section':
        return (
          <SectionElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </SectionElement>
        )
      case 'column':
      case 'columns':
        return (
          <ColumnsElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </ColumnsElement>
        )
      case 'card':
        return (
          <CardElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </CardElement>
        )
      case 'badge':
        return <BadgeElement {...commonProps} />
      case 'alert':
        return <AlertElement {...commonProps} />
      case 'tooltip':
        return (
          <TooltipElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </TooltipElement>
        )
      case 'slider':
        return <SliderElement {...commonProps} />
      case 'carousel':
        return <CarouselElement {...commonProps} />
      case 'map':
        return <MapElement {...commonProps} />
      case 'chart':
        return <ChartElement {...commonProps} />
      case 'navbar':
        return <NavbarElement {...commonProps} />
      case 'footer':
        return <FooterElement {...commonProps} />
      case 'breadcrumb':
        return <BreadcrumbElement {...commonProps} />
      case 'rating':
        return <RatingElement {...commonProps} />
      case 'search':
        return <SearchElement {...commonProps} />
      case 'gallery':
        return <GalleryElement {...commonProps} />
      case 'newsletter':
        return <NewsletterElement {...commonProps} />
      case 'contact':
        return (
          <ContactElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </ContactElement>
        )
      case 'sidebar':
        return (
          <SidebarElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </SidebarElement>
        )
      case 'blog':
        return <BlogElement {...commonProps} />
      case 'portfolio':
        return <PortfolioElement {...commonProps} />
      case 'services':
        return <ServicesElement {...commonProps} />
      case 'clients':
        return <ClientsElement {...commonProps} />
      case 'partners':
        return <PartnersElement {...commonProps} />
      case 'awards':
        return <AwardsElement {...commonProps} />
      case 'notification':
        return <NotificationElement {...commonProps} />
      case 'filter':
        return <FilterElement {...commonProps} />
      case 'table':
        return <TableElement {...commonProps} />
      case 'code':
        return <CodeElement {...commonProps} />
      case 'icon':
        return <IconElement {...commonProps} />
      case 'social':
        return <SocialElement {...commonProps} />
      case 'row':
        return (
          <RowElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </RowElement>
        )
      case 'about':
        return (
          <AboutElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </AboutElement>
        )
      case 'banner':
        return <BannerElement {...commonProps} />
      case 'popup':
        return (
          <PopupElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </PopupElement>
        )
      case 'audio':
        return <AudioElement {...commonProps} />
      case 'pdf':
        return <PdfElement {...commonProps} />
      case 'download':
        return <DownloadElement {...commonProps} />
      case 'pagination':
        return <PaginationElement {...commonProps} />
      case 'comments':
        return <CommentsElement {...commonProps} />
      case 'share':
        return <ShareElement {...commonProps} />
      case 'login':
        return <LoginElement {...commonProps} />
      case 'cart':
        return <CartElement {...commonProps} />
      case 'embed':
        return <EmbedElement {...commonProps} />
      case 'register':
        return <RegisterElement {...commonProps} />
      case 'checkout':
        return <CheckoutElement {...commonProps} />
      case 'wishlist':
        return <WishlistElement {...commonProps} />
      case 'compare':
        return <CompareElement {...commonProps} />
      case 'quickview':
        return <QuickviewElement {...commonProps} />
      // TODO: Add more element types as we create them
      default:
        return (
          <div className="p-4 border border-dashed border-muted-foreground rounded">
            <p className="text-sm text-muted-foreground">
              Element type "{element.type}" coming soon
            </p>
          </div>
        )
    }
  }

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isHovered && !isSelected && 'ring-1 ring-slate-300',
        isDragHovered && 'ring-2 ring-green-400'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      style={getResponsiveStyle()}
    >
      {/* Element Content */}
      {renderElement()}

      {/* Element Controls */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 flex items-center space-x-1 bg-background border border-border rounded-md shadow-sm px-2 py-1 z-50">
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {element.type}
          </span>
          <div className="w-px h-4 bg-border mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              // Open properties panel or show settings
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleDuplicate}
          >
            <Copy className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Drag Handle */}
      {isSelected && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-background cursor-move">
          <Move className="h-2 w-2 text-primary-foreground m-1" />
        </div>
      )}

      {/* Element Label */}
      {isSelected && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
          {element.type}
        </div>
      )}
    </div>
  )
}
