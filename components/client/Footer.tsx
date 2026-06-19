import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import FooterConfig from '@/models/FooterConfig'
import ContactConfig from '@/models/ContactConfig'
import type { LocaleKey } from '@/types/multilang'

type Cfg = Record<string, Record<string, string>>

function ml(cfg: Cfg | null, key: string, lang: string): string {
  return cfg?.[key]?.[lang] || cfg?.[key]?.['vi'] || ''
}

function plain(cfg: Cfg | null, key: string): string {
  const v = (cfg as unknown as Record<string, unknown>)?.[key]
  return typeof v === 'string' ? v : ''
}

export async function Footer({ lang }: { lang: LocaleKey }) {
  let footer: Cfg | null = null
  let contact: Cfg | null = null
  try {
    await connectDB()
    footer  = await FooterConfig.findOne({ key: 'global' }).lean() as unknown as Cfg
    contact = await ContactConfig.findOne({ key: 'global' }).lean() as unknown as Cfg
  } catch {}

  const f   = (key: string) => ml(footer,  key, lang)
  const c   = (key: string) => ml(contact, key, lang)
  const fs  = (key: string) => plain(footer, key) || plain(contact, key)

  const navLinks = [
    { href: `/${lang}/gioi-thieu`, label: f('navAbout')    || 'Giới thiệu' },
    { href: `/${lang}/tin-tuc`,    label: f('navBlog')     || 'Tin tức' },
    { href: `/${lang}/tuyen-dung`, label: f('navCareers')  || 'Tuyển dụng' },
    { href: `/${lang}/lien-he`,    label: f('navContact')  || 'Liên hệ' },
  ]

  const services = [f('service1'), f('service2'), f('service3'), f('service4')].filter(Boolean)
  const phone    = fs('phone')
  const hotline  = fs('hotline')
  const email    = fs('email')
  const address  = c('address')
  const year     = new Date().getFullYear()
  const copyright = f('copyright') || `© ${year} WON Media. All rights reserved.`

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-navy-deep)', color: 'var(--on-dark-body)', marginTop: 'var(--space-20)' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--color-teal),var(--color-indigo),var(--color-teal))', backgroundSize: '200% 100%' }} />

      <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,169,143,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '64px 24px 0' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px 40px', paddingBottom: 56 }} className="footer-grid">

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <img src="/logo.png" alt="WON Media" style={{ width: 110, height: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.95 }} />

            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', maxWidth: 280, margin: 0 }}>
              {f('brandDesc') || 'Đơn vị tiên phong trong phân phối âm nhạc số và quản lý bản quyền tại Việt Nam.'}
            </p>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {[
                { href: 'https://www.facebook.com/wonmediavn', label: 'Facebook', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { href: 'https://www.youtube.com/@wonmedia',   label: 'YouTube',  d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                { href: 'https://www.tiktok.com/@wonmedia',    label: 'TikTok',   d: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.06a8.21 8.21 0 0 0 4.8 1.54v-3.4a4.85 4.85 0 0 1-1.03-.51z' },
              ].map(({ href, label, d }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{ width: 38, height: 38, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', flexShrink: 0 }}
                  className="footer-social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d={d} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-teal-light)', marginBottom: 20 }}>
              Khám phá
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}
                  style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', padding: '5px 0', display: 'block', transition: 'color 0.15s', textDecoration: 'none' }}
                  className="footer-nav-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-teal-light)', marginBottom: 20 }}>
              {f('servicesHeading') || 'Dịch vụ'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(services.length ? services : ['Phát hành âm nhạc', 'Khai thác bản quyền', 'Marketing âm nhạc', 'Sản xuất nội dung']).map((s, i) => (
                <span key={i} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', padding: '5px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-teal)', flexShrink: 0, opacity: 0.7 }} />
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-teal-light)', marginBottom: 20 }}>
              Liên hệ
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {address && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-teal-light)' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{address}</span>
                </div>
              )}

              {(phone || hotline) && (
                <a href={`tel:${phone || hotline}`}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none', transition: 'opacity 0.15s' }}
                  className="footer-contact-link">
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-teal-light)' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{phone || hotline}</span>
                </a>
              )}

              {email && (
                <a href={`mailto:${email}`}
                  style={{ display: 'inline-flex', gap: 10, alignItems: 'center', textDecoration: 'none', padding: '9px 14px', borderRadius: 10, background: 'rgba(0,169,143,0.1)', border: '1px solid rgba(0,169,143,0.25)', transition: 'all 0.2s', width: 'fit-content' }}
                  className="footer-email-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-teal-light)', flexShrink: 0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{email}</span>
                </a>
              )}

            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          <span>{copyright}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#ff6b81' }}>♥</span>
            Made in Vietnam
          </span>
        </div>
      </div>

      <style>{`
        .footer-grid { }
        .footer-social-btn:hover { background: var(--color-teal) !important; border-color: var(--color-teal) !important; color: #fff !important; transform: translateY(-2px); }
        .footer-nav-link:hover { color: #fff !important; padding-left: 4px !important; }
        .footer-contact-link:hover { opacity: 0.8; }
        .footer-email-btn:hover { background: rgba(0,169,143,0.18) !important; border-color: rgba(0,169,143,0.5) !important; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
          .footer-grid > div:last-child  { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px 0 !important; }
          .footer-grid > div:first-child, .footer-grid > div:last-child { grid-column: auto; }
        }
      `}</style>
    </footer>
  )
}
