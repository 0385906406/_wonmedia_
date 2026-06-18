import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import FooterConfig from '@/models/FooterConfig'
import ContactConfig from '@/models/ContactConfig'
import type { LocaleKey } from '@/types/multilang'

type Cfg = Record<string, Record<string, string>>

function ml(cfg: Cfg | null, key: string, lang: string): string {
  return cfg?.[key]?.[lang] || cfg?.[key]?.['vi'] || ''
}

export async function Footer({ lang }: { lang: LocaleKey }) {
  let footer: Cfg | null = null
  let contact: Cfg | null = null
  try {
    await connectDB()
    footer  = await FooterConfig.findOne({ key: 'global' }).lean() as unknown as Cfg
    contact = await ContactConfig.findOne({ key: 'global' }).lean() as unknown as Cfg
  } catch { /* DB unavailable — render empty */ }

  const f = (key: string) => ml(footer,  key, lang)
  const c = (key: string) => ml(contact, key, lang)

  const navLinks = [
    { href: `/${lang}/gioi-thieu`, label: f('navAbout') },
    { href: `/${lang}/tin-tuc`,    label: f('navBlog') },
    { href: `/${lang}/tuyen-dung`, label: f('navCareers') },
    { href: `/${lang}/lien-he`,    label: f('navContact') },
  ].filter(l => l.label)

  const services = [f('service1'), f('service2'), f('service3'), f('service4')].filter(Boolean)

  const year = new Date().getFullYear()
  const copyright = f('copyright') || `© ${year} WON Media. All rights reserved.`

  return (
    <footer className="qp-footer">
      {/* Rice watermark */}
      <div className="qp-footer__rice" />

      <div className="qp-footer__inner container">
        <div className="qp-footer__top">

          {/* Col 1 — Brand */}
          <div className="qp-footer__col qp-footer__brand">
            <div className="qp-brand">
              <div className="qp-brand__mark" style={{ width: 120, height: 'auto', flexShrink: 0 }}>
                <img
                  src="/logo.png"
                  alt="WON Media"
                  style={{ width: 120, height: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>

            {(c('address') || f('locationCity')) && (
              <p className="qp-footer__desc">
                {f('locationCity') && `${f('locationCity')}. `}{c('address')}
              </p>
            )}

            {/* Social links */}
            <div className="qp-footer__social">
              <a href="https://www.facebook.com/wonmediavn" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@wonmedia" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@wonmedia" target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.06a8.21 8.21 0 0 0 4.8 1.54v-3.4a4.85 4.85 0 0 1-1.03-.51z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div className="qp-footer__col">
            <h4>{f('navHeading') || 'Khám phá'}</h4>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>

          {/* Col 3 — Services */}
          <div className="qp-footer__col">
            <h4>{f('servicesHeading') || 'Dịch vụ'}</h4>
            {services.length > 0
              ? services.map((s, i) => (
                  <span key={i} style={{ display: 'block', padding: '5px 0', color: 'var(--on-dark-body)', fontSize: 13 }}>{s}</span>
                ))
              : (
                <>
                  <span style={{ display: 'block', padding: '5px 0', color: 'var(--on-dark-body)', fontSize: 13 }}>Phát hành âm nhạc</span>
                  <span style={{ display: 'block', padding: '5px 0', color: 'var(--on-dark-body)', fontSize: 13 }}>Khai thác bản quyền</span>
                  <span style={{ display: 'block', padding: '5px 0', color: 'var(--on-dark-body)', fontSize: 13 }}>Quản lý nghệ sĩ</span>
                </>
              )
            }
          </div>

          {/* Col 4 — Contact */}
          <div className="qp-footer__col qp-footer__contact">
            <h4>{f('contactHeading') || 'Liên hệ'}</h4>

            {c('phone') && (
              <a href={`tel:${c('phone')}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {c('phone')}
              </a>
            )}

            {c('hotline') && (
              <a href={`tel:${c('hotline')}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {c('hotline')}
              </a>
            )}

            {c('email') && (
              <a href={`mailto:${c('email')}`} className="qp-footer__email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {c('email')}
              </a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="qp-footer__bottom">
          <span>{copyright}</span>
          <span className="qp-footer__madein">
            <span className="qp-footer__heart">♥</span>
            Made in Vietnam
          </span>
        </div>
      </div>
    </footer>
  )
}
