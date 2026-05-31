import { notFound } from 'next/navigation'
import { hasLocale, type Locale, getDictionary } from './dictionaries'
import { NavbarClient } from '@/components/client/NavbarClient'
import { AnimationObserver } from '@/components/client/AnimationObserver'
import { Footer } from '@/components/client/Footer'
import { PhoneButton } from '@/components/client/PhoneButton'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import ContactConfig from '@/models/ContactConfig'

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

  // Lấy số điện thoại từ DB
  let phone = ''
  try {
    await connectDB()
    const cfg = await ContactConfig.findOne({ key: 'global' }).lean() as { phone?: string } | null
    phone = cfg?.phone ?? ''
  } catch { /* ignore */ }

  const navItems = [
    { href: `/${lang}`,            label: dict.nav.home },
    { href: `/${lang}/gioi-thieu`, label: dict.nav.about },
    { href: `/${lang}/tuyen-dung`, label: dict.nav.career },
    { href: `/${lang}/tin-tuc`,    label: dict.nav.blog },
    { href: `/${lang}/lien-he`,    label: dict.nav.contact },
  ]

  return (
    <div lang={lang} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--wm-dark)' }}>
      {/* Global scroll animation observer */}
      <AnimationObserver />

      {/* Sticky Navbar */}
      <NavbarClient lang={lang} navItems={navItems} loginLabel={dict.nav.login} />

      <main style={{ flex: 1 }}>{children}</main>

      <Footer lang={lang as LocaleKey} />
      <PhoneButton phone={phone} lang={lang} />
    </div>
  )
}
