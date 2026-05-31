import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICollectionItem extends Document {
    collectionId: mongoose.Types.ObjectId
    data: Record<string, unknown>
    createdAt: Date
    updatedAt: Date
}

const CollectionItemSchema = new Schema<ICollectionItem>(
    {
        collectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Collection',
            required: true,
            index: true,
        },
        data: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
)

const CollectionItem: Model<ICollectionItem> =
    mongoose.models.CollectionItem ||
    mongoose.model<ICollectionItem>('CollectionItem', CollectionItemSchema)

export default CollectionItem
