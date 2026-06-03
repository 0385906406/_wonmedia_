import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment extends Document {
  postId:    string
  postSlug:  string
  userId:    string
  userName:  string
  userEmail: string
  content:   string
  likes:     { userId: string }[]
  parentId:  string | null
  active:    boolean
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    postId:    { type: String, required: true, index: true },
    postSlug:  { type: String, required: true },
    userId:    { type: String, required: true },
    userName:  { type: String, required: true },
    userEmail: { type: String, required: true },
    content:   { type: String, required: true, maxlength: 2000 },
    likes:     [{ userId: String }],
    parentId:  { type: String, default: null },
    active:    { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

export default Comment
