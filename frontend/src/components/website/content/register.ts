import { registerComponent } from '../registry'
import {
  SocialMediaFeed,
  SocialMediaFeedConfig,
  SocialMediaLinks,
  SocialMediaLinksConfig,
  BlogPostCard,
  BlogPostCardConfig,
  TestimonialCard,
  TestimonialCardConfig,
  FeatureCard,
  FeatureCardConfig,
  NotificationCenter,
  NotificationCenterConfig
} from './index'

// Register new Week 4 content components
registerComponent(SocialMediaFeedConfig, SocialMediaFeed)
registerComponent(SocialMediaLinksConfig, SocialMediaLinks)
registerComponent(BlogPostCardConfig, BlogPostCard)
registerComponent(TestimonialCardConfig, TestimonialCard)
registerComponent(FeatureCardConfig, FeatureCard)
registerComponent(NotificationCenterConfig, NotificationCenter)
