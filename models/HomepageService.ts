import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MultiLang } from '@/types/multilang'

export interface IHomepageService extends Document {
  order: number
  iconKey: string
  title: MultiLang
  desc: MultiLang
  active: boolean
  link: string
  createdAt: Date
  updatedAt: Date
}

const MLSchema = {
  vi: { type: String, default: '' },
  en: { type: String, default: '' },
  ko: { type: String, default: '' },
  ja: { type: String, default: '' },
  zh: { type: String, default: '' },
}

const HomepageServiceSchema = new Schema<IHomepageService>(
  {
    order:   { type: Number, default: 0 },
    iconKey: { type: String, default: 'play' },
    title:   { ...MLSchema },
    desc:    { ...MLSchema },
    active:  { type: Boolean, default: true },
    link:    { type: String, default: '' },
  },
  { timestamps: true }
)

const HomepageService: Model<IHomepageService> =
  mongoose.models.HomepageService ||
  mongoose.model<IHomepageService>('HomepageService', HomepageServiceSchema)

export default HomepageService
