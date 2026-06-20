import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'

type EmailConfig = {
  serviceId: string
  templateId: string
  publicKey: string
  privateKey: string
  toEmail: string
}

async function getEmailConfig(): Promise<EmailConfig> {
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'global' }).lean() as {
      integrations?: {
        emailjsServiceId?: string
        emailjsTemplateId?: string
        emailjsPublicKey?: string
        emailjsPrivateKey?: string
        emailjsToEmail?: string
      }
    } | null
    const db = setting?.integrations ?? {}
    return {
      serviceId:  db.emailjsServiceId?.trim()  || process.env.EMAILJS_SERVICE_ID?.trim()  || '',
      templateId: db.emailjsTemplateId?.trim() || process.env.EMAILJS_TEMPLATE_ID?.trim() || '',
      publicKey:  db.emailjsPublicKey?.trim()  || process.env.EMAILJS_PUBLIC_KEY?.trim()  || '',
      privateKey: db.emailjsPrivateKey?.trim() || process.env.EMAILJS_PRIVATE_KEY?.trim() || '',
      toEmail:    db.emailjsToEmail?.trim()    || process.env.EMAILJS_TO_EMAIL?.trim()     || '',
    }
  } catch {
    return {
      serviceId:  process.env.EMAILJS_SERVICE_ID?.trim()  || '',
      templateId: process.env.EMAILJS_TEMPLATE_ID?.trim() || '',
      publicKey:  process.env.EMAILJS_PUBLIC_KEY?.trim()  || '',
      privateKey: process.env.EMAILJS_PRIVATE_KEY?.trim() || '',
      toEmail:    process.env.EMAILJS_TO_EMAIL?.trim()    || '',
    }
  }
}

export async function sendContactNotification(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const { serviceId, templateId, publicKey, privateKey, toEmail } = await getEmailConfig()

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      return { ok: false, reason: 'emailjs_not_configured' }
    }

    const emailjs = await import('@emailjs/nodejs')

    const result = await emailjs.default.send(
      serviceId,
      templateId,
      {
        to_email: toEmail,
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        reply_to: data.email,
      },
      { publicKey, privateKey }
    )

    if (result.status === 200) return { ok: true }

    console.error('[email] EmailJS error:', result.text)
    return { ok: false, reason: result.text }
  } catch (err) {
    console.error('[email] sendContactNotification unexpected error:', err)
    return { ok: false, reason: String(err) }
  }
}
