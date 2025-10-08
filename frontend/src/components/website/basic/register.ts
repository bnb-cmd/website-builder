import { registerComponent } from '../registry'
import { 
  Heading, 
  HeadingConfig,
  Text,
  TextConfig,
  WebsiteButton,
  ButtonConfig,
  WebsiteImage,
  ImageConfig,
  Divider,
  DividerConfig,
  Typography,
  TypographyConfig,
  Spacer,
  SpacerConfig,
  WebsiteIcon,
  IconConfig,
  WebsiteLink,
  LinkConfig,
  WebsiteBadge,
  BadgeConfig,
  WebsiteCode,
  CodeConfig,
  WebsiteQuote,
  QuoteConfig,
  WebsiteHighlight,
  HighlightConfig,
  WebsiteTooltip,
  TooltipConfig,
  WebsiteProgress,
  ProgressConfig
} from './index'

// Register basic components
registerComponent(HeadingConfig, Heading)
registerComponent(TextConfig, Text)
registerComponent(ButtonConfig, WebsiteButton)
registerComponent(ImageConfig, WebsiteImage)
registerComponent(DividerConfig, Divider)
registerComponent(TypographyConfig, Typography)
registerComponent(SpacerConfig, Spacer)
registerComponent(IconConfig, WebsiteIcon)
registerComponent(LinkConfig, WebsiteLink)
registerComponent(BadgeConfig, WebsiteBadge)
registerComponent(CodeConfig, WebsiteCode)
registerComponent(QuoteConfig, WebsiteQuote)
registerComponent(HighlightConfig, WebsiteHighlight)
registerComponent(TooltipConfig, WebsiteTooltip)
registerComponent(ProgressConfig, WebsiteProgress)
