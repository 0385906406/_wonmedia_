import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISettingGeneral {
    portalName: string
    tagline: string
    publicDomain: string
    systemEmail: string
}

export interface ISettingHeader {
    navDisplayName: string
    faviconUrl: string
    logoEn: string
    logoVi: string
    logoImageUrl: string
}

export interface ISettingIntegrations {
    geminiApiKey: string
    geminiModel: string
    newsApiKey: string
    newsApiUrl: string
    resendApiKey: string
    resendFromEmail: string
    resendToEmail: string
    emailjsServiceId: string
    emailjsTemplateId: string
    emailjsPublicKey: string
    emailjsPrivateKey: string
    emailjsToEmail: string
}

export interface ISetting extends Document {
    key: string
    general: ISettingGeneral
    header: ISettingHeader
    integrations: ISettingIntegrations
    updatedAt: Date
}

const SettingSchema = new Schema<ISetting>(
    {
        key: { type: String, required: true, unique: true, default: 'global' },
        general: {
            portalName: { type: String, default: '' },
            tagline: { type: String, default: '' },
            publicDomain: { type: String, default: '' },
            systemEmail: { type: String, default: '' },
        },
        header: {
            navDisplayName: { type: String, default: '' },
            faviconUrl: { type: String, default: '' },
            logoEn: { type: String, default: '' },
            logoVi: { type: String, default: '' },
            logoImageUrl: { type: String, default: '' },
        },
        integrations: {
            geminiApiKey:     { type: String, default: '' },
            geminiModel:      { type: String, default: 'gemini-1.5-flash' },
            newsApiKey:       { type: String, default: '' },
            newsApiUrl:       { type: String, default: '' },
            resendApiKey:       { type: String, default: '' },
            resendFromEmail:    { type: String, default: '' },
            resendToEmail:      { type: String, default: '' },
            emailjsServiceId:   { type: String, default: '' },
            emailjsTemplateId:  { type: String, default: '' },
            emailjsPublicKey:   { type: String, default: '' },
            emailjsPrivateKey:  { type: String, default: '' },
            emailjsToEmail:     { type: String, default: '' },
        },
    },
    { timestamps: true }
)

const Setting: Model<ISetting> =
    mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)

export default Setting
