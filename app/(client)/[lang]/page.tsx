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

// ─── Fallback defaults (shown if DB is empty / not seeded yet) ───────────────
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

// ─── DB fetch helpers (with fallback) ────────────────────────────────────────
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
      services: services.length ? services.map(s => ({ title: (s.title as Record<string, string>)[lang] || (s.title as Record<string, string>).vi || '', desc: (s.desc as Record<string, string>)[lang] || (s.desc as Record<string, string>).vi || '', iconKey: s.iconKey })) : null,
      achievements: achievements.length ? achievements.map(a => ({ value: a.value, label: (a.label as Record<string, string>)[lang] || (a.label as Record<string, string>).vi || '' })) : null,
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
    // DB not connected (dev without .env) — return nulls to use fallbacks
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
]

const FALLBACK_POSTS = [
  { id: '1', date: '15/06/2025', category: 'Sự kiện', type: 'blog' as const, thumbnail: '/posts/recap-yep-2025.jpg', title: 'Recap Year End Party WON Media 2025', excerpt: 'Nhìn lại những khoảnh khắc đáng nhớ tại buổi tiệc cuối năm WON Media 2025.', slug: 'recap-year-end-party-2025' },
  { id: '2', date: '08/03/2025', category: 'Nội bộ', type: 'blog' as const, thumbnail: '/posts/women-day-won-media.jpg', title: 'Ngày Quốc tế Phụ nữ tại WON Media 2025', excerpt: 'WON Media tri ân những người phụ nữ tài năng nhân ngày 8/3.', slug: 'women-day-won-media-2025' },
  { id: '3', date: '20/12/2024', category: 'Sự kiện', type: 'blog' as const, thumbnail: '/posts/year-end-party-won-media.jpg', title: 'Year End Party WON Media 2024', excerpt: 'Bữa tiệc cuối năm rực rỡ cùng toàn thể đội ngũ WON Media.', slug: 'year-end-party-2024' },
  { id: '4', date: '01/01/2026', category: 'Tuyển dụng', type: 'tuyen-dung' as const, thumbnail: '/posts/post_1.png', title: 'Tuyển dụng nhân sự WON Media 2026', excerpt: 'WON Media đang tìm kiếm những nhân tài mới để cùng phát triển.', slug: 'tuyen-dung-2026' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ClientHomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const db = await fetchHomepageData(lang as LocaleKey)

  const cta = CTA_LABELS[lang] ?? CTA_LABELS.en
  const hero = db.hero as typeof DEFAULT_HERO
  const heroTitle = (hero.title as Record<string, string>)[lang] || (hero.title as Record<string, string>).vi
  const heroTitle2 = (hero.title2 as Record<string, string>)[lang] || (hero.title2 as Record<string, string>).vi
  const heroSubtitle = (hero.subtitle as Record<string, string>)[lang] || (hero.subtitle as Record<string, string>).vi

  const services = db.services ?? (dict.services.items as Array<{ title: string; desc: string }>)
  const achievements = db.achievements ?? (dict.achievements.items as Array<{ value: number; label: string }>)
  const partners = db.partners ?? FALLBACK_PARTNERS
  const posts = db.posts ?? FALLBACK_POSTS

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = dict as any
  const postsHeading = d.posts?.heading ?? 'BÀI VIẾT'
  const postsSeeMore = d.posts?.see_more ?? 'Xem thêm'
  const achievementsHeading = d.achievements?.heading ?? 'THÀNH TỰU'
  const servicesHeading = d.services?.heading ?? 'DỊCH VỤ CỦA CHÚNG TÔI'
  const partnersHeading = d.partners?.heading ?? 'ĐỐI TÁC CỦA CHÚNG TÔI'

  return (
    <div style={{ background: 'var(--wm-dark)', fontFamily: 'var(--font-vi)' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', color: '#fff', userSelect: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/banners/banner.png" alt="WON Media" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.8) contrast(1.1) saturate(1.15)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(25,27,36,0.65) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 0)', backgroundSize: '3px 3px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, var(--wm-mid))' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 'clamp(80px,12vh,120px) 20px clamp(60px,8vh,80px)' }}>
          <h1 className="wm-hero-title-anim" style={{ fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.88, color: '#fff', margin: '0 0 6px', textShadow: '0 4px 40px rgba(0,0,0,0.4)', fontFamily: 'var(--font-vi)' }}>
            {heroTitle}
          </h1>
          <h1 className="wm-hero-title-anim wm-shimmer-text" style={{ fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.88, margin: '0 0 36px', animationDelay: '0.12s', fontFamily: 'var(--font-vi)' }}>
            {heroTitle2}
          </h1>
          <p className="wm-hero-sub-anim" style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.82)', maxWidth: '520px', margin: '0 auto 44px', lineHeight: 1.75, fontFamily: 'var(--font-vi)' }}>
            {heroSubtitle}
          </p>
          <div className="wm-hero-cta-anim" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`/${lang}/gioi-thieu`} className="wm-btn-green-hero" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-vi)' }}>
              {cta.primary}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <a href={`/${lang}/lien-he`} className="wm-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '100px', background: 'transparent', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-vi)' }}>
              {cta.secondary}
            </a>
          </div>
          <div className="wm-hero-scroll-anim" style={{ marginTop: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.55 }}>
            <span style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: '24px', height: '40px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6px 0' }}>
              <div style={{ width: '4px', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.8)', animation: 'wm-scroll-dot 1.8s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <ServicesCarousel items={services} heading={servicesHeading} />

      {/* ── Achievements ── */}
      <AchievementsSection heading={achievementsHeading} items={achievements} />

      {/* ── Partners ── */}
      <PartnersSection heading={partnersHeading} items={partners} />

      {/* ── Posts ── */}
      <PostsCarousel posts={posts} heading={postsHeading} seeMore={postsSeeMore} lang={lang} />

      <style>{`
        @keyframes wm-scroll-dot {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(14px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
