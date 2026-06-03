import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MultiLang } from '@/types/multilang'

export interface ICategory extends Document {
  slug: string
  name: MultiLang
  forType: 'blog' | 'tuyen-dung' | 'all'
  active: boolean
  order: number
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

const CategorySchema = new Schema<ICategory>(
  {
    slug:    { type: String, required: true, unique: true, trim: true },
    name:    { ...MLSchema },
    forType: { type: String, enum: ['blog', 'tuyen-dung', 'all'], default: 'all' },
    active:  { type: Boolean, default: true },
    order:   { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema)

export default Category
