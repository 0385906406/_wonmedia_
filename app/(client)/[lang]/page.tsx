import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from './dictionaries'
import { ServicesCarousel } from '@/components/client/ServicesCarousel'
import { AchievementsSection } from '@/components/client/AchievementsSection'
import { PostsCarousel } from '@/components/client/PostsCarousel'
import { PartnersSection } from '@/components/client/PartnersSection'
import { connectDB } from '@/lib/mongodb'
import HomepageHero from '@/models/HomepageHero'
import HomepageService from '@/models/HomepageService'
import HomepageAchievement from '@/models/HomepageAchievement'
import HomepagePartner from '@/models/HomepagePartner'
import Post from '@/models/Post'
import HomepagePostsConfig from '@/models/HomepagePostsConfig'
import type { LocaleKey } from '@/types/multilang'
import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://wonmedia.vn'

const SEO_HOME: Record<LocaleKey, { title: string; desc: string }> = {
  vi: { title: 'WON Media – Truyền thông & Giải trí chuyên nghiệp', desc: 'WON Media cung cấp dịch vụ truyền thông, quảng cáo và giải trí chuyên nghiệp tại Việt Nam.' },
  en: { title: 'WON Media – Professional Media & Entertainment',    desc: 'WON Media provides professional media, advertising and entertainment services in Vietnam.' },
  ko: { title: 'WON Media – 전문 미디어 & 엔터테인먼트',              desc: 'WON Media는 베트남의 전문 미디어, 광고 및 엔터테인먼트 서비스를 제공합니다.' },
  ja: { title: 'WON Media – プロのメディア & エンターテインメント',    desc: 'WON Mediaはベトナムのプロのメディア、広告、エンターテインメントサービスを提供します。' },
  zh: { title: 'WON Media – 专业媒体与娱乐',                          desc: 'WON Media在越南提供专业的媒体、广告和娱乐服务。' },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const lk = lang as LocaleKey
  const { title, desc } = SEO_HOME[lk]
  const url = `${SITE}/${lang}`
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { vi: `${SITE}/vi`, en: `${SITE}/en`, ko: `${SITE}/ko`, ja: `${SITE}/ja`, zh: `${SITE}/zh` },
    },
    openGraph: { title, description: desc, url, type: 'website', siteName: 'WON Media', locale: lk },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

// ─── Fallback defaults ────────────────────────────────────────────────────────
const DEFAULT_HERO = {
  title:    { vi: 'BRINGING MUSIC', en: 'BRINGING MUSIC', ko: 'BRINGING MUSIC', ja: 'BRINGING MUSIC', zh: 'BRINGING MUSIC' },
  title2:   { vi: 'TO THE WORLD',   en: 'TO THE WORLD',   ko: 'TO THE WORLD',   ja: 'TO THE WORLD',   zh: 'TO THE WORLD' },
  subtitle: {
    vi: 'WON Media – Đơn vị phát hành âm nhạc & khai thác bản quyền hàng đầu Việt Nam.',
    en: 'WON Media – Vietnam\'s leading music distribution & copyright management company.',
    ko: 'WON Media – 베트남 최고의 음악 배급 및 저작권 관리 회사.',
    ja: 'WON Media – ベトナムを代表する音楽配信・著作権管理会社。',
    zh: 'WON Media – 越南领先的音乐发行与版权管理公司。',
  },
}

const CTA_LABELS: Record<string, { primary: string; secondary: string }> = {
  vi: { primary: 'Khám phá dịch vụ', secondary: 'Liên hệ ngay' },
  en: { primary: 'Explore Services',  secondary: 'Contact Us' },
  ko: { primary: '서비스 탐색',          secondary: '문의하기' },
  ja: { primary: 'サービスを見る',       secondary: 'お問い合わせ' },
  zh: { primary: '探索服务',            secondary: '立即联系' },
}

const POSTS_LABELS: Record<string, { subheading: string; readMore: string }> = {
  vi: { subheading: 'Tin tức & Tuyển dụng', readMore: 'Xem thêm' },
  en: { subheading: 'News & Careers',        readMore: 'Read more' },
  ko: { subheading: '뉴스 & 채용',             readMore: '더 보기' },
  ja: { subheading: 'ニュース & 採用',          readMore: '続きを読む' },
  zh: { subheading: '新闻 & 招聘',             readMore: '阅读更多' },
}

const SECTION_LABELS: Record<string, { achievements: string; partners: string }> = {
  vi: { achievements: 'Những con số ấn tượng',       partners: 'Đối tác của chúng tôi' },
  en: { achievements: 'Our Impressive Numbers',       partners: 'Our Partners' },
  ko: { achievements: '인상적인 수치들',                 partners: '우리의 파트너' },
  ja: { achievements: '印象的な数字',                   partners: '私たちのパートナー' },
  zh: { achievements: '令人印象深刻的数字',              partners: '我们的合作伙伴' },
}

// ─── DB fetch ────────────────────────────────────────────────────────────────
async function fetchHomepageData(lang: LocaleKey) {
  try {
    await connectDB()

    const [hero, services, achievements, partners, postsConfig] = await Promise.all([
      HomepageHero.findOne({ key: 'main' }).lean(),
      HomepageService.find({ active: true }).sort({ order: 1 }).lean(),
      HomepageAchievement.find({ active: true }).sort({ order: 1 }).lean(),
      HomepagePartner.find({ active: true }).sort({ order: 1 }).lean(),
      HomepagePostsConfig.findOne({ key: 'posts' }).lean(),
    ])

    const cfg = postsConfig as { mode?: string; selectedIds?: string[]; limit?: number } | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let posts: any[]
    if (cfg?.mode === 'manual' && cfg.selectedIds?.length) {
      posts = await Post.find({ _id: { $in: cfg.selectedIds }, active: true }).sort({ createdAt: -1 }).lean()
    } else {
      const autoLimit = cfg?.limit ?? 6
      posts = await Post.find({ active: true }).sort({ createdAt: -1 }).limit(autoLimit).lean()
    }

    return {
      hero: hero ?? DEFAULT_HERO,
      services: services.length ? services.map(s => ({
        title: (s.title as Record<string, string>)[lang] || (s.title as Record<string, string>).vi || '',
        desc: (s.desc as Record<string, string>)[lang] || (s.desc as Record<string, string>).vi || '',
        iconKey: s.iconKey,
      })) : null,
      achievements: achievements.length ? achievements.map(a => ({
        value: a.value,
        label: (a.label as Record<string, string>)[lang] || (a.label as Record<string, string>).vi || '',
      })) : null,
      partners: partners.length ? partners.map(p => ({ src: p.logo, alt: p.name })) : null,
      posts: posts.length ? posts.map(p => ({
        id: (p._id as { toString(): string }).toString(),
        date: p.date,
        category: (p.category as Record<string, string>)[lang] || (p.category as Record<string, string>).vi || '',
        type: p.type as 'blog' | 'tuyen-dung',
        thumbnail: p.thumbnail,
        title: (p.title as Record<string, string>)[lang] || (p.title as Record<string, string>).vi || '',
        excerpt: (p.excerpt as Record<string, string>)[lang] || (p.excerpt as Record<string, string>).vi || '',
        slug: p.slug,
      })) : null,
    }
  } catch {
    return { hero: DEFAULT_HERO, services: null, achievements: null, partners: null, posts: null }
  }
}

// ─── Fallback static data ────────────────────────────────────────────────────
const FALLBACK_PARTNERS = [
  { src: '/partners/youtube.png',    alt: 'YouTube' },
  { src: '/partners/facebook.png',   alt: 'Facebook' },
  { src: '/partners/instagram.png',  alt: 'Instagram' },
  { src: '/partners/tiktok.png',     alt: 'TikTok' },
  { src: '/partners/spotify.png',    alt: 'Spotify' },
  { src: '/partners/apple-music.png',alt: 'Apple Music' },
  { src: '/partners/vtv.png',        alt: 'VTV' },
  { src: '/partners/vov.png',        alt: 'VOV' },
  { src: '/partners/vtvcab.png',     alt: 'VTVcab' },
  { src: '/partners/vtv-news.png',   alt: 'VTV News' },
  { src: '/partners/style-tv.png',   alt: 'Style TV' },
]

type FP = { id: string; date: string; category: string; type: 'blog' | 'tuyen-dung'; thumbnail: string; title: string; excerpt: string; slug: string }
function getFallbackPosts(lang: string): FP[] {
  const CAT_EVENT:  Record<string, string> = { vi: 'Sự kiện',    en: 'Event',    ko: '이벤트', ja: 'イベント', zh: '活动' }
  const CAT_INNER:  Record<string, string> = { vi: 'Nội bộ',     en: 'Internal', ko: '내부',   ja: '社内',     zh: '内部' }
  const CAT_CAREER: Record<string, string> = { vi: 'Tuyển dụng', en: 'Career',   ko: '채용',   ja: '採用',     zh: '招聘' }
  const TITLE_1: Record<string, string> = { vi: 'Recap Year End Party WON Media 2025', en: 'WON Media Year End Party 2025 Recap', ko: 'WON Media 연말파티 2025 리캡', ja: 'WON Media 年末パーティー 2025 振り返り', zh: 'WON Media 2025年终派对回顾' }
  const EX_1:   Record<string, string> = { vi: 'Nhìn lại những khoảnh khắc đáng nhớ tại buổi tiệc cuối năm WON Media 2025.', en: 'A look back at the memorable moments from WON Media Year End Party 2025.', ko: 'WON Media 2025 연말파티의 기억에 남는 순간들을 돌아봅니다.', ja: 'WON Media 2025年末パーティーの思い出の瞬間を振り返ります。', zh: '回顾WON Media 2025年终派对中难忘的精彩瞬间。' }
  const TITLE_2: Record<string, string> = { vi: "Ngày Quốc tế Phụ nữ tại WON Media 2025", en: "Women's Day at WON Media 2025", ko: "WON Media 2025 세계 여성의 날", ja: "WON Media 2025 国際女性デー", zh: "WON Media 2025 国际妇女节" }
  const EX_2:   Record<string, string> = { vi: 'WON Media tri ân những người phụ nữ tài năng nhân ngày 8/3.', en: 'WON Media celebrates talented women on International Women\'s Day.', ko: 'WON Media가 세계 여성의 날을 맞아 재능 있는 여성들에게 감사를 전합니다.', ja: 'WON Mediaが国際女性デーに優秀な女性たちへの感謝を捧げます。', zh: 'WON Media在国际妇女节感谢优秀的女性们。' }
  const TITLE_3: Record<string, string> = { vi: 'Year End Party WON Media 2024', en: 'WON Media Year End Party 2024', ko: 'WON Media 2024 연말파티', ja: 'WON Media 2024年末パーティー', zh: 'WON Media 2024年终派对' }
  const EX_3:   Record<string, string> = { vi: 'Bữa tiệc cuối năm rực rỡ cùng toàn thể đội ngũ WON Media.', en: 'A spectacular year-end celebration with the entire WON Media team.', ko: 'WON Media 전 팀과 함께하는 화려한 연말파티.', ja: 'WON Mediaチーム全員での華やかな年末パーティー。', zh: '与WON Media全体团队共度精彩的年终派对。' }
  const TITLE_4: Record<string, string> = { vi: 'Tuyển dụng nhân sự WON Media 2026', en: 'WON Media is Hiring 2026', ko: 'WON Media 2026 채용 공고', ja: 'WON Media 2026年度採用情報', zh: 'WON Media 2026招聘公告' }
  const EX_4:   Record<string, string> = { vi: 'WON Media đang tìm kiếm những nhân tài mới để cùng phát triển.', en: 'WON Media is looking for new talent to grow together.', ko: 'WON Media는 함께 성장할 새로운 인재를 찾고 있습니다.', ja: 'WON Mediaは共に成長する新しい人材を募集しています。', zh: 'WON Media正在寻找共同成长的新人才。' }
  const l = (o: Record<string, string>) => o[lang] ?? o.vi
  return [
    { id: '1', date: '15/06/2025', category: l(CAT_EVENT),  type: 'blog',       thumbnail: '/posts/recap-yep-2025.jpg',          title: l(TITLE_1), excerpt: l(EX_1), slug: 'recap-year-end-party-2025' },
    { id: '2', date: '08/03/2025', category: l(CAT_INNER),  type: 'blog',       thumbnail: '/posts/women-day-won-media.jpg',      title: l(TITLE_2), excerpt: l(EX_2), slug: 'women-day-won-media-2025' },
    { id: '3', date: '20/12/2024', category: l(CAT_EVENT),  type: 'blog',       thumbnail: '/posts/year-end-party-won-media.jpg', title: l(TITLE_3), excerpt: l(EX_3), slug: 'year-end-party-2024' },
    { id: '4', date: '01/01/2026', category: l(CAT_CAREER), type: 'tuyen-dung', thumbnail: '/posts/post_1.png',                   title: l(TITLE_4), excerpt: l(EX_4), slug: 'tuyen-dung-2026' },
  ]
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ClientHomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const db = await fetchHomepageData(lang as LocaleKey)

  const cta = CTA_LABELS[lang] ?? CTA_LABELS.en
  const hero = db.hero as typeof DEFAULT_HERO
  const heroTitle    = (hero.title    as Record<string, string>)[lang] || (hero.title    as Record<string, string>).vi
  const heroTitle2   = (hero.title2   as Record<string, string>)[lang] || (hero.title2   as Record<string, string>).vi
  const heroSubtitle = (hero.subtitle as Record<string, string>)[lang] || (hero.subtitle as Record<string, string>).vi

  const services     = db.services     ?? (dict.services.items     as Array<{ title: string; desc: string }>)
  const achievements = db.achievements ?? (dict.achievements.items as Array<{ value: number; label: string }>)
  const partners     = db.partners     ?? FALLBACK_PARTNERS
  const posts        = db.posts        ?? getFallbackPosts(lang)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = dict as any
  const postsHeading        = d.posts?.heading          ?? 'BÀI VIẾT'
  const postsSeeMore        = d.posts?.see_more         ?? 'Xem thêm'
  const achievementsHeading = d.achievements?.heading   ?? 'THÀNH TỰU'
  const servicesHeading     = d.services?.heading       ?? 'DỊCH VỤ'
  const partnersHeading     = d.partners?.heading       ?? 'ĐỐI TÁC'
  const postsL              = POSTS_LABELS[lang]         ?? POSTS_LABELS.vi
  const sectionL            = SECTION_LABELS[lang]       ?? SECTION_LABELS.vi

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', width: '100%', minHeight: '100vh', marginTop: 'calc(-1 * var(--topbar-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', color: '#fff', userSelect: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/banners/banner.png" alt="WON Media" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.8) contrast(1.1) saturate(1.15)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(25,27,36,0.65) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 0)', backgroundSize: '3px 3px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, var(--wm-mid))' }} />
        </div>

        <div className="wm-hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 'clamp(80px,12vh,120px) 20px clamp(60px,8vh,80px)' }}>
          <h1 className="wm-hero-title-anim wm-hero-h1" style={{ fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.88, color: '#fff', margin: '0 0 6px', textShadow: '0 4px 40px rgba(0,0,0,0.4)', fontFamily: 'var(--font-primary)' }}>
            {heroTitle}
          </h1>
          <h1 className="wm-hero-title-anim wm-shimmer-text wm-hero-h1" style={{ fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.88, margin: '0 0 28px', animationDelay: '0.12s', fontFamily: 'var(--font-primary)' }}>
            {heroTitle2}
          </h1>
          <p className="wm-hero-sub-anim wm-hero-sub" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.75, fontFamily: 'var(--font-primary)' }}>
            {heroSubtitle}
          </p>
          <div className="wm-hero-cta-anim wm-hero-ctas">
            <a href={`/${lang}/gioi-thieu`} className="wm-btn-green-hero wm-hero-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-primary)' }}>
              {cta.primary}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <a href={`/${lang}/lien-he`} className="wm-btn-outline wm-hero-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '100px', background: 'transparent', color: '#fff', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-primary)' }}>
              {cta.secondary}
            </a>
          </div>
          <div className="wm-hero-scroll-anim wm-hero-scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.55 }}>
            <span style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: '24px', height: '40px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6px 0' }}>
              <div style={{ width: '4px', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.8)', animation: 'wm-scroll-dot 1.8s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <ServicesCarousel items={services} heading={servicesHeading} lang={lang} />

      {/* ── Achievements / KPI strip ── */}
      <AchievementsSection heading={achievementsHeading} subheading={sectionL.achievements} items={achievements} />

      {/* ── Partners ── */}
      <PartnersSection heading={partnersHeading} subheading={sectionL.partners} items={partners} />

      {/* ── Posts ── */}
      <PostsCarousel posts={posts} heading={postsHeading} subheading={postsL.subheading} seeMore={postsSeeMore} readMore={postsL.readMore} lang={lang} />

      <style>{`
        /* Hero — desktop */
        .wm-hero-h1   { font-size: clamp(52px, 10vw, 120px); }
        .wm-hero-sub  { font-size: 17px; }
        .wm-hero-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .wm-hero-btn-primary  { padding: 15px 36px; font-size: 15px; }
        .wm-hero-btn-secondary { padding: 14px 32px; font-size: 15px; }
        .wm-hero-scroll { margin-top: 64px; }

        /* Hero — mobile */
        @media (max-width: 640px) {
          .wm-hero-content { padding: 100px 24px 48px !important; }
          .wm-hero-h1 { font-size: 7.8vw; letter-spacing: -1px !important; white-space: nowrap; }
          .wm-hero-sub { font-size: 14px; margin-bottom: 28px !important; }
          .wm-hero-ctas { flex-direction: column; align-items: center; gap: 10px; }
          .wm-hero-btn-primary  { padding: 13px 28px; font-size: 14px; width: fit-content; }
          .wm-hero-btn-secondary { padding: 12px 28px; font-size: 14px; width: fit-content; }
          .wm-hero-scroll { margin-top: 36px; }
        }

        @keyframes wm-scroll-dot {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(14px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
      `}</style>
    </>
  )
}
