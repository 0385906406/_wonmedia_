import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICollectionField {
    key: string
    label: string
    type: 'text' | 'number' | 'email' | 'url' | 'textarea' | 'boolean'
    required: boolean
}

export interface ICollection extends Document {
    name: string
    slug: string
    description: string
    important: boolean
    fields: ICollectionField[]
    createdAt: Date
    updatedAt: Date
}

const FieldSchema = new Schema<ICollectionField>(
    {
        key: { type: String, required: true },
        label: { type: String, required: true },
        type: {
            type: String,
            enum: ['text', 'number', 'email', 'url', 'textarea', 'boolean'],
            default: 'text',
        },
        required: { type: Boolean, default: false },
    },
    { _id: false }
)

const CollectionSchema = new Schema<ICollection>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, default: '' },
        important: { type: Boolean, default: false },
        fields: [FieldSchema],
    },
    { timestamps: true }
)

const Collection: Model<ICollection> =
    mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema)

export default Collection
