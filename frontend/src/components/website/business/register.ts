import { registerComponent } from '../registry'
import { 
  ContactForm, 
  ContactFormConfig,
  Map,
  MapConfig,
  WebsitePhone,
  PhoneConfig,
  WebsiteEmail,
  EmailConfig,
  WebsiteTeamMember,
  TeamMemberConfig,
  WebsiteServiceCard,
  ServiceCardConfig,
  WebsitePricingTable,
  PricingTableConfig,
  WebsiteFeatureList,
  FeatureListConfig,
  WebsiteAboutSection,
  AboutSectionConfig,
  WebsiteContactInfo,
  ContactInfoConfig,
  WebsiteLocationCard,
  LocationCardConfig,
  WebsiteHours,
  HoursConfig,
  WebsiteReviews,
  ReviewsConfig,
  WebsiteCTA,
  CTAConfig
} from './index'

// Register business components
registerComponent(ContactFormConfig, ContactForm)
registerComponent(MapConfig, Map)
registerComponent(PhoneConfig, WebsitePhone)
registerComponent(EmailConfig, WebsiteEmail)
registerComponent(TeamMemberConfig, WebsiteTeamMember)
registerComponent(ServiceCardConfig, WebsiteServiceCard)
registerComponent(PricingTableConfig, WebsitePricingTable)
registerComponent(FeatureListConfig, WebsiteFeatureList)
registerComponent(AboutSectionConfig, WebsiteAboutSection)
registerComponent(ContactInfoConfig, WebsiteContactInfo)
registerComponent(LocationCardConfig, WebsiteLocationCard)
registerComponent(HoursConfig, WebsiteHours)
registerComponent(ReviewsConfig, WebsiteReviews)
registerComponent(CTAConfig, WebsiteCTA)
