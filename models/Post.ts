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
  likes: string[]
  categoryId: string
  seoTitle: MultiLang
  seoDescription: MultiLang
  seoKeywords: MultiLang
  ogImage: string
  thumbnailPosition: string
  // Job-specific fields (chỉ dùng khi type === 'tuyen-dung')
  urgent: boolean
  deadline: string
  jobType: string
  location: string
  salary: string
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
    likes:          [{ type: String }],
    categoryId:     { type: String, default: '' },
    seoTitle:       { ...MLSchema },
    seoDescription: { ...MLSchema },
    seoKeywords:    { ...MLSchema },
    ogImage:             { type: String, default: '' },
    thumbnailPosition:   { type: String, default: 'center center' },
    urgent:              { type: Boolean, default: false },
    deadline:            { type: String, default: '' },
    jobType:             { type: String, default: '' },
    location:            { type: String, default: '' },
    salary:              { type: String, default: '' },
  },
  { timestamps: true }
)

// Xoá cache model trong dev để tránh dùng schema cũ sau khi thêm field mới
if (process.env.NODE_ENV !== 'production' && mongoose.models.Post) {
  delete (mongoose.models as Record<string, unknown>).Post
}

const Post: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) || mongoose.model<IPost>('Post', PostSchema)

export default Post
