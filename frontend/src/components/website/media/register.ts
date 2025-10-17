import { registerComponent } from '../registry'
import {
  VideoPlayer,
  VideoPlayerConfig,
  AudioPlayer,
  AudioPlayerConfig
} from './index'

// Register new Week 4 media components
registerComponent(VideoPlayerConfig, VideoPlayer)
registerComponent(AudioPlayerConfig, AudioPlayer)
