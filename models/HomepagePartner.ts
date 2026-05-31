import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IHomepagePartner extends Document {
  order: number
  name: string
  logo: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const HomepagePartnerSchema = new Schema<IHomepagePartner>(
  {
    order:  { type: Number, default: 0 },
    name:   { type: String, default: '' },
    logo:   { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const HomepagePartner: Model<IHomepagePartner> =
  mongoose.models.HomepagePartner ||
  mongoose.model<IHomepagePartner>('HomepagePartner', HomepagePartnerSchema)

export default HomepagePartner
