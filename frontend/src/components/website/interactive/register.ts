import { registerComponent } from '../registry'
import {
  Carousel,
  CarouselConfig,
  CountdownTimer,
  CountdownTimerConfig,
  Tabs,
  TabsConfig,
  Modal,
  ModalConfig,
  Lightbox,
  LightboxConfig,
  BeforeAfter,
  BeforeAfterConfig,
  ProgressBar,
  ProgressBarConfig,
  Rating,
  RatingConfig,
  ShareButtons,
  ShareButtonsConfig,
  BackToTop,
  BackToTopConfig,
  StickyHeader,
  StickyHeaderConfig,
  ScrollProgress,
  ScrollProgressConfig,
  ImageHotspot,
  ImageHotspotConfig,
  ParallaxSection,
  ParallaxSectionConfig,
  LazyLoad,
  LazyLoadConfig
} from './index'

// Register all interactive components
registerComponent(CarouselConfig, Carousel)
registerComponent(CountdownTimerConfig, CountdownTimer)
registerComponent(TabsConfig, Tabs)
registerComponent(ModalConfig, Modal)
registerComponent(LightboxConfig, Lightbox)
registerComponent(BeforeAfterConfig, BeforeAfter)
registerComponent(ProgressBarConfig, ProgressBar)
registerComponent(RatingConfig, Rating)
registerComponent(ShareButtonsConfig, ShareButtons)
registerComponent(BackToTopConfig, BackToTop)
registerComponent(StickyHeaderConfig, StickyHeader)
registerComponent(ScrollProgressConfig, ScrollProgress)
registerComponent(ImageHotspotConfig, ImageHotspot)
registerComponent(ParallaxSectionConfig, ParallaxSection)
registerComponent(LazyLoadConfig, LazyLoad)
