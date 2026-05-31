import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IContactSubmission extends Document {
  name: string; email: string; subject: string; message: string
  read: boolean; createdAt: Date
}

delete (mongoose.models as Record<string, unknown>).ContactSubmission
const ContactSubmissionSchema = new Schema<IContactSubmission>({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true })

const ContactSubmission: Model<IContactSubmission> =
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema)
export default ContactSubmission
