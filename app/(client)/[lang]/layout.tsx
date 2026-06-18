import { notFound } from 'next/navigation'
import { hasLocale, type Locale, getDictionary } from './dictionaries'
import { NavbarClient } from '@/components/client/NavbarClient'
import { AnimationObserver } from '@/components/client/AnimationObserver'
import { HtmlLang } from '@/components/client/HtmlLang'
import { Footer } from '@/components/client/Footer'
import { PhoneButton } from '@/components/client/PhoneButton'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import ContactConfig from '@/models/ContactConfig'
import Setting from '@/models/Setting'

export function generateStaticParams() {
  return [
    { lang: 'vi' },
    { lang: 'en' },
    { lang: 'ko' },
    { lang: 'ja' },
    { lang: 'zh' },
  ]
}

export default async function ClientLangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)

  // Lấy phone + settings song song
  let phone = ''
  let logoUrl = ''
  let brandName = ''
  try {
    await connectDB()
    const [cfg, setting] = await Promise.all([
      ContactConfig.findOne({ key: 'global' }).lean() as Promise<{ phone?: string } | null>,
      Setting.findOne({ key: 'global' }).lean() as Promise<{ header?: { logoImageUrl?: string; navDisplayName?: string } } | null>,
    ])
    phone = cfg?.phone ?? ''
    logoUrl   = setting?.header?.logoImageUrl  ?? ''
    brandName = setting?.header?.navDisplayName ?? ''
  } catch { /* ignore */ }

  const navItems = [
    { href: `/${lang}`,            label: dict.nav.home },
    { href: `/${lang}/gioi-thieu`, label: dict.nav.about },
    { href: `/${lang}/tuyen-dung`, label: dict.nav.career },
    { href: `/${lang}/tin-tuc`,    label: dict.nav.blog },
    { href: `/${lang}/lien-he`,    label: dict.nav.contact },
  ]

  return (
    <div lang={lang} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)' }}>
      <HtmlLang lang={lang} />
      {/* Global scroll animation observer */}
      <AnimationObserver />

      {/* Sticky Navbar */}
      <NavbarClient lang={lang} navItems={navItems} logoUrl={logoUrl} brandName={brandName} />

      <main style={{ flex: 1, paddingTop: 'var(--topbar-height)' }}>{children}</main>

      <Footer lang={lang as LocaleKey} />
      <PhoneButton phone={phone} lang={lang} />
    </div>
  )
}
