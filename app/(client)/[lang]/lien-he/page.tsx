import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { ContactClient, type ContactT } from '@/components/client/contact/ContactClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import ContactConfig from '@/models/ContactConfig'

async function loadContact(lang: LocaleKey): Promise<ContactT> {
  await connectDB()
  const raw = await ContactConfig.findOne({ key: 'global' }).lean() as Record<string, unknown> | null
  const ml = (key: string) => (raw?.[key] as Record<string, string>)?.[lang] || (raw?.[key] as Record<string, string>)?.vi || ''
  const str = (key: string) => (raw?.[key] as string) || ''
  return {
    lang,
    bannerSubtitle: ml('bannerSubtitle'), bannerTitle: ml('bannerTitle'),
    address: ml('address'),
    phone: str('phone'), hotline: str('hotline'),
    email: str('email'), zalo: str('zalo'),
    googleMapsUrl: str('googleMapsUrl'), googleMapsEmbed: str('googleMapsEmbed'),
    formTitle: ml('formTitle'), formSubtitle: ml('formSubtitle'),
  }
}

export default async function LienHePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = await loadContact(lang as LocaleKey)
  return <ContactClient t={t} />
}
