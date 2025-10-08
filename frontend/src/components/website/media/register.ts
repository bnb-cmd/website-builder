import { registerComponent } from '../registry'
import { 
  WebsiteVideo, 
  VideoConfig,
  Calendar,
  CalendarConfig
} from './index'

// Register media components
registerComponent(VideoConfig, WebsiteVideo)
registerComponent(CalendarConfig, Calendar)
