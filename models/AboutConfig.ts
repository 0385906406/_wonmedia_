import mongoose, { Schema, Document, Model } from 'mongoose'

const ML = {
  vi: { type: String, default: '' },
  en: { type: String, default: '' },
  ko: { type: String, default: '' },
  ja: { type: String, default: '' },
  zh: { type: String, default: '' },
}

export interface IAboutConfig extends Document {
  key: string
  bannerSubtitle: Record<string, string>
  bannerTitle: Record<string, string>
  aboutLabel: Record<string, string>
  aboutTitleLine1: Record<string, string>
  aboutTitleHighlight: Record<string, string>
  aboutDesc1Prefix: Record<string, string>
  aboutDesc1Year: Record<string, string>
  aboutDesc1Suffix: Record<string, string>
  aboutDesc2: Record<string, string>
  aboutExpValue: Record<string, string>
  aboutExpText: Record<string, string>
  aboutButton: Record<string, string>
  timelineHeading: Record<string, string>
  timelineMilestones: { title: Record<string, string>; line1: Record<string, string>; line2: Record<string, string> }[]
  whyUsHeading: Record<string, string>
  whyUsReasons: { title: Record<string, string>; desc: Record<string, string> }[]
  servicesHeading: Record<string, string>
  servicesItems: { title: Record<string, string>; desc: Record<string, string> }[]
}

const MLArr = { title: ML, line1: ML, line2: ML }
const MLPair = { title: ML, desc: ML }

delete (mongoose.models as Record<string, unknown>).AboutConfig
const AboutConfigSchema = new Schema<IAboutConfig>({
  key:                 { type: String, default: 'global', unique: true },
  bannerSubtitle:      ML, bannerTitle: ML,
  aboutLabel:          ML, aboutTitleLine1: ML, aboutTitleHighlight: ML,
  aboutDesc1Prefix:    ML, aboutDesc1Year: ML, aboutDesc1Suffix: ML,
  aboutDesc2:          ML, aboutExpValue: ML, aboutExpText: ML, aboutButton: ML,
  timelineHeading:     ML,
  timelineMilestones:  [MLArr],
  whyUsHeading:        ML,
  whyUsReasons:        [MLPair],
  servicesHeading:     ML,
  servicesItems:       [MLPair],
}, { timestamps: true })

const AboutConfig: Model<IAboutConfig> =
  mongoose.model<IAboutConfig>('AboutConfig', AboutConfigSchema)

export default AboutConfig
