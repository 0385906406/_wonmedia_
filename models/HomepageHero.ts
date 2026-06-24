import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MultiLang } from '@/types/multilang'

export interface IHomepageHero extends Document {
  key: string
  title: MultiLang
  title2: MultiLang
  subtitle: MultiLang
  heroImageUrl: string
  ctaPrimary: MultiLang
  ctaSecondary: MultiLang
  servicesHeading: MultiLang
  achievementsHeading: MultiLang
  achievementsSubheading: MultiLang
  partnersHeading: MultiLang
  partnersSubheading: MultiLang
  postsHeading: MultiLang
  postsSubheading: MultiLang
  postsSeeMore: MultiLang
  postsReadMore: MultiLang
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
    heroImageUrl: { type: String, default: '' },
    ctaPrimary:   { ...MLSchema },
    ctaSecondary: { ...MLSchema },
    servicesHeading:        { ...MLSchema },
    achievementsHeading:    { ...MLSchema },
    achievementsSubheading: { ...MLSchema },
    partnersHeading:        { ...MLSchema },
    partnersSubheading:     { ...MLSchema },
    postsHeading:           { ...MLSchema },
    postsSubheading:        { ...MLSchema },
    postsSeeMore:           { ...MLSchema },
    postsReadMore:          { ...MLSchema },
  },
  { timestamps: true }
)

// Delete cached model so schema changes take effect on hot reload
if (mongoose.models.HomepageHero) delete (mongoose.models as Record<string, unknown>).HomepageHero

const HomepageHero: Model<IHomepageHero> =
  mongoose.model<IHomepageHero>('HomepageHero', HomepageHeroSchema)

export default HomepageHero
