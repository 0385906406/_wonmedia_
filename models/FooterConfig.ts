import mongoose, { Schema, Document, Model } from 'mongoose'

const ML = { vi: { type: String, default: '' }, en: { type: String, default: '' }, ko: { type: String, default: '' }, ja: { type: String, default: '' }, zh: { type: String, default: '' } }

export interface IFooterConfig extends Document {
  key: string
  companyName: Record<string, string>
  brandDesc: Record<string, string>
  // Nav links
  navAbout: Record<string, string>
  navServices: Record<string, string>
  navCareers: Record<string, string>
  navBlog: Record<string, string>
  navContact: Record<string, string>
  // Services
  servicesHeading: Record<string, string>
  service1: Record<string, string>
  service2: Record<string, string>
  service3: Record<string, string>
  service4: Record<string, string>
  // Location
  locationHeading: Record<string, string>
  locationCity: Record<string, string>
  // Contact values
  phone: string
  hotline: string
  email: string
  zalo: string
  // Social links
  facebookUrl: string
  youtubeUrl: string
  tiktokUrl: string
  // Bottom
  copyright: Record<string, string>
}

const FooterConfigSchema = new Schema<IFooterConfig>({
  key: { type: String, default: 'global', unique: true },
  companyName: ML, brandDesc: ML,
  navAbout: ML, navServices: ML, navCareers: ML, navBlog: ML, navContact: ML,
  servicesHeading: ML, service1: ML, service2: ML, service3: ML, service4: ML,
  locationHeading: ML, locationCity: ML,
  phone: { type: String, default: '' },
  hotline: { type: String, default: '' },
  email: { type: String, default: '' },
  zalo: { type: String, default: '' },
  facebookUrl: { type: String, default: '' },
  youtubeUrl:  { type: String, default: '' },
  tiktokUrl:   { type: String, default: '' },
  copyright: ML,
}, { strict: false, timestamps: true })

const FooterConfig: Model<IFooterConfig> =
  (mongoose.models.FooterConfig as Model<IFooterConfig>) || mongoose.model<IFooterConfig>('FooterConfig', FooterConfigSchema)
export default FooterConfig
