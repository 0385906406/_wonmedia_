import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MultiLang } from '@/types/multilang'

export interface IHomepageAchievement extends Document {
  order: number
  value: number
  iconKey: string
  label: MultiLang
  active: boolean
  color?: string
  createdAt: Date
  updatedAt: Date
}

const HomepageAchievementSchema = new Schema<IHomepageAchievement>(
  {
    order:   { type: Number, default: 0 },
    value:   { type: Number, default: 0 },
    iconKey: { type: String, default: '' },
    label:   {
      vi: { type: String, default: '' },
      en: { type: String, default: '' },
      ko: { type: String, default: '' },
      ja: { type: String, default: '' },
      zh: { type: String, default: '' },
    },
    active: { type: Boolean, default: true },
    color:  { type: String, default: '' },
  },
  { timestamps: true }
)

const HomepageAchievement: Model<IHomepageAchievement> =
  mongoose.models.HomepageAchievement ||
  mongoose.model<IHomepageAchievement>('HomepageAchievement', HomepageAchievementSchema)

export default HomepageAchievement
