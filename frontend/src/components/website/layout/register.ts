import { registerComponent } from '../registry'
import { 
  Container, 
  ContainerConfig,
  Columns,
  ColumnsConfig,
  HeroSection,
  HeroSectionConfig,
  WebsiteGrid,
  GridConfig,
  WebsiteFlexbox,
  FlexboxConfig,
  WebsiteCard,
  CardConfig,
  WebsiteSection,
  SectionConfig,
  WebsiteSidebar,
  SidebarConfig,
  WebsiteHeader,
  HeaderConfig,
  WebsiteFooter,
  FooterConfig,
  WebsiteNavigation,
  NavigationConfig,
  WebsiteBreadcrumb,
  BreadcrumbConfig,
  WebsitePagination,
  PaginationConfig
} from './index'

// Register layout components
registerComponent(ContainerConfig, Container)
registerComponent(ColumnsConfig, Columns)
registerComponent(HeroSectionConfig, HeroSection)
registerComponent(GridConfig, WebsiteGrid)
registerComponent(FlexboxConfig, WebsiteFlexbox)
registerComponent(CardConfig, WebsiteCard)
registerComponent(SectionConfig, WebsiteSection)
registerComponent(SidebarConfig, WebsiteSidebar)
registerComponent(HeaderConfig, WebsiteHeader)
registerComponent(FooterConfig, WebsiteFooter)
registerComponent(NavigationConfig, WebsiteNavigation)
registerComponent(BreadcrumbConfig, WebsiteBreadcrumb)
registerComponent(PaginationConfig, WebsitePagination)
