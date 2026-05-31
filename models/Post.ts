import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MultiLang } from '@/types/multilang'

export interface IPost extends Document {
  slug: string
  type: 'blog' | 'tuyen-dung'
  thumbnail: string
  date: string
  showOnHomepage: boolean
  category: MultiLang
  title: MultiLang
  excerpt: MultiLang
  content: MultiLang
  active: boolean
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

const PostSchema = new Schema<IPost>(
  {
    slug:           { type: String, required: true, unique: true, trim: true },
    type:           { type: String, enum: ['blog', 'tuyen-dung'], default: 'blog' },
    thumbnail:      { type: String, default: '' },
    date:           { type: String, default: '' },
    showOnHomepage: { type: Boolean, default: false },
    category:       { ...MLSchema },
    title:          { ...MLSchema },
    excerpt:        { ...MLSchema },
    content:        { ...MLSchema },
    active:         { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
