import { registerComponent } from '../registry'
import { 
  Gallery, 
  GalleryConfig,
  Testimonials,
  TestimonialsConfig,
  List,
  ListConfig,
  WebsiteAccordion,
  AccordionConfig,
  WebsiteTabs,
  TabsConfig,
  WebsiteTimeline,
  TimelineConfig,
  WebsiteFAQ,
  FAQConfig,
  WebsiteBlogPost,
  BlogPostConfig,
  WebsiteArticle,
  ArticleConfig,
  WebsiteNewsletter,
  NewsletterConfig,
  WebsiteSocialMedia,
  SocialMediaConfig,
  WebsiteSearch,
  SearchConfig,
  WebsiteFilter,
  FilterConfig
} from './index'

// Register content components
registerComponent(GalleryConfig, Gallery)
registerComponent(TestimonialsConfig, Testimonials)
registerComponent(ListConfig, List)
registerComponent(AccordionConfig, WebsiteAccordion)
registerComponent(TabsConfig, WebsiteTabs)
registerComponent(TimelineConfig, WebsiteTimeline)
registerComponent(FAQConfig, WebsiteFAQ)
registerComponent(BlogPostConfig, WebsiteBlogPost)
registerComponent(ArticleConfig, WebsiteArticle)
registerComponent(NewsletterConfig, WebsiteNewsletter)
registerComponent(SocialMediaConfig, WebsiteSocialMedia)
registerComponent(SearchConfig, WebsiteSearch)
registerComponent(FilterConfig, WebsiteFilter)
