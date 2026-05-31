import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IHomepagePostsConfig extends Document {
  key: string
  mode: 'auto' | 'manual'
  selectedIds: string[]
  limit: number
}

const HomepagePostsConfigSchema = new Schema<IHomepagePostsConfig>({
  key:         { type: String, default: 'posts', unique: true },
  mode:        { type: String, enum: ['auto', 'manual'], default: 'auto' },
  selectedIds: [{ type: String }],
  limit:       { type: Number, default: 6, min: 1, max: 20 },
}, { timestamps: true })

// Xoá cache khi schema thay đổi (tránh Mongoose strict-mode bỏ qua field mới)
delete (mongoose.models as Record<string, unknown>).HomepagePostsConfig
const HomepagePostsConfig: Model<IHomepagePostsConfig> =
  mongoose.model<IHomepagePostsConfig>('HomepagePostsConfig', HomepagePostsConfigSchema)

export default HomepagePostsConfig
