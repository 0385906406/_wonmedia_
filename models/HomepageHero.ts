import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MultiLang } from '@/types/multilang'

export interface IHomepageHero extends Document {
  key: string
  title: MultiLang
  title2: MultiLang
  subtitle: MultiLang
  updatedAt: Date
}

const MLSchema = {
  vi: { type: String, default: '' },
  en: { type: String, default: '' },
  ko: { type: String, default: '' },
  ja: { type: String, default: '' },
  zh: { type: String, default: '' },
}

const HomepageHeroSchema = new Schema<IHomepageHero>(
  {
    key: { type: String, default: 'main', unique: true },
    title:    { ...MLSchema },
    title2:   { ...MLSchema },
    subtitle: { ...MLSchema },
  },
  { timestamps: true }
)

const HomepageHero: Model<IHomepageHero> =
  mongoose.models.HomepageHero ||
  mongoose.model<IHomepageHero>('HomepageHero', HomepageHeroSchema)

export default HomepageHero
