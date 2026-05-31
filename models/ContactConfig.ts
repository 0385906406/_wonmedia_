import mongoose, { Schema, Document, Model } from 'mongoose'

const ML = { vi: { type: String, default: '' }, en: { type: String, default: '' }, ko: { type: String, default: '' }, ja: { type: String, default: '' }, zh: { type: String, default: '' } }

export interface IContactConfig extends Document {
  key: string
  bannerSubtitle: Record<string, string>
  bannerTitle: Record<string, string>
  address: Record<string, string>
  phone: string
  hotline: string
  email: string
  zalo: string
  googleMapsUrl: string
  googleMapsEmbed: string
  formTitle: Record<string, string>
  formSubtitle: Record<string, string>
}

delete (mongoose.models as Record<string, unknown>).ContactConfig
const ContactConfigSchema = new Schema<IContactConfig>({
  key:             { type: String, default: 'global', unique: true },
  bannerSubtitle:  ML, bannerTitle: ML,
  address:         ML,
  phone:           { type: String, default: '' },
  hotline:         { type: String, default: '' },
  email:           { type: String, default: '' },
  zalo:            { type: String, default: '' },
  googleMapsUrl:   { type: String, default: '' },
  googleMapsEmbed: { type: String, default: '' },
  formTitle:       ML,
  formSubtitle:    ML,
}, { strict: false, timestamps: true })

const ContactConfig: Model<IContactConfig> = mongoose.model<IContactConfig>('ContactConfig', ContactConfigSchema)
export default ContactConfig
