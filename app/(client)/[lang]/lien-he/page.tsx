import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { ContactClient, type ContactT } from '@/components/client/contact/ContactClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import ContactConfig from '@/models/ContactConfig'
import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://wonmedia.vn'

const SEO_CONTACT: Record<LocaleKey, { title: string; desc: string }> = {
  vi: { title: 'Liên hệ – WON Media',   desc: 'Liên hệ với WON Media để được tư vấn và hỗ trợ dịch vụ truyền thông chuyên nghiệp.' },
  en: { title: 'Contact – WON Media',   desc: 'Contact WON Media for consultation and professional media service support.' },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const lk = lang as LocaleKey
  const { title, desc } = SEO_CONTACT[lk]
  const url = `${SITE}/${lang}/lien-he`
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { vi: `${SITE}/vi/lien-he`, en: `${SITE}/en/lien-he`, ko: `${SITE}/ko/lien-he`, ja: `${SITE}/ja/lien-he`, zh: `${SITE}/zh/lien-he` },
    },
    openGraph: { title, description: desc, url, type: 'website', siteName: 'WON Media', locale: lk },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

type L = Record<string, string>
const tf = (vi: string, en: string, ko?: string, ja?: string, zh?: string): L => ({
  vi, en, ko: ko ?? en, ja: ja ?? en, zh: zh ?? en,
})

function getFallbackContact(lang: LocaleKey): ContactT {
  const pick = (o: L) => o[lang] ?? o.vi
  return {
    lang,
    bannerSubtitle: pick(tf(
      'Liên hệ với chúng tôi',
      'Contact Us',
      '문의하기',
      'お問い合わせ',
      '联系我们',
    )),
    bannerTitle: pick(tf('LIÊN HỆ', 'GET IN TOUCH', '연락하기', 'お問い合わせ', '联系我们')),
    address: pick(tf(
      'Tầng 2, Tòa nhà Audi, Số 8 đường Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội',
      '2nd Floor, Audi Building, No. 8 Pham Hung St., Me Tri, Nam Tu Liem, Hanoi, Vietnam',
      '베트남 하노이 남투리엠구 메트리 팜훙로 8번지 아우디 빌딩 2층',
      'ベトナム・ハノイ市ナムトゥリエム区メトリ、ファムフン通り8番、オーディビル2階',
      '越南河内市南慈廉郡美池坊范雄路8号奥迪大厦2层',
    )),
    phone:           '035 258 8886',
    hotline:         '035 258 8886',
    email:           'contact@wonmedia.vn',
    zalo:            '035 258 8886',
    googleMapsUrl:   'https://www.google.com/maps/search/?api=1&query=8+Pham+Hung+Me+Tri+Nam+Tu+Liem+Hanoi+Vietnam',
    googleMapsEmbed: '',
    formTitle: pick(tf(
      'GỬI YÊU CẦU',
      'SEND A MESSAGE',
      '메시지 보내기',
      'メッセージを送る',
      '发送消息',
    )),
    formSubtitle: pick(tf(
      'Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
      'Fill in the form below and we will get back to you within 24 business hours.',
      '아래 양식을 작성해 주시면 영업일 기준 24시간 내에 답변드리겠습니다.',
      '下記フォームにご記入ください。営業日24時間以内にご返信いたします。',
      '请填写下方表单，我们将在24个工作小时内回复您。',
    )),
  }
}

async function loadContact(lang: LocaleKey): Promise<ContactT> {
  try {
    await connectDB()
    const raw = await ContactConfig.findOne({ key: 'global' }).lean() as Record<string, unknown> | null
    if (!raw) return getFallbackContact(lang)

    const ml  = (key: string) => (raw[key] as Record<string, string>)?.[lang] || (raw[key] as Record<string, string>)?.vi || ''
    const str = (key: string) => (raw[key] as string) || ''
    const fb  = getFallbackContact(lang)

    return {
      lang,
      bannerSubtitle:  ml('bannerSubtitle')  || fb.bannerSubtitle,
      bannerTitle:     ml('bannerTitle')     || fb.bannerTitle,
      address:         ml('address')         || fb.address,
      phone:           str('phone')          || fb.phone,
      hotline:         str('hotline')        || fb.hotline,
      email:           str('email')          || fb.email,
      zalo:            str('zalo')           || fb.zalo,
      googleMapsUrl:   str('googleMapsUrl')  || fb.googleMapsUrl,
      googleMapsEmbed: str('googleMapsEmbed')|| fb.googleMapsEmbed,
      formTitle:       ml('formTitle')       || fb.formTitle,
      formSubtitle:    ml('formSubtitle')    || fb.formSubtitle,
    }
  } catch {
    return getFallbackContact(lang)
  }
}

export default async function LienHePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = await loadContact(lang as LocaleKey)
  return <ContactClient t={t} />
}
