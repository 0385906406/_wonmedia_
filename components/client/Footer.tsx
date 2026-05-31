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
    { href: `/${lang}/gioi-thieu`, label: f('navAbout')    },
    { href: `/${lang}/tin-tuc`,    label: f('navBlog')     },
    { href: `/${lang}/tuyen-dung`, label: f('navCareers')  },
    { href: `/${lang}/lien-he`,    label: f('navContact')  },
  ].filter(l => l.label)

  const services = [
    f('service1'), f('service2'), f('service3'), f('service4'),
  ].filter(Boolean)

  return (
    <footer className="bg-[#062340] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

          {/* Col 1 — Brand */}
          <div className="space-y-4 lg:col-span-1">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-green-400 uppercase mb-1">WON MEDIA</p>
              {f('companyName') && (
                <h3 className="text-sm font-bold text-white/90 leading-tight">{f('companyName')}</h3>
              )}
            </div>
            <div className="space-y-2 text-sm text-white/60">
              {(f('locationHeading') || f('locationCity')) && (
                <p>
                  {f('locationHeading') && <span className="text-white/40 text-xs">{f('locationHeading')} </span>}
                  {f('locationCity')    && <span className="font-semibold text-white/80">{f('locationCity')}</span>}
                </p>
              )}
              {c('address') && <p className="leading-relaxed">{c('address')}</p>}
              <div className="space-y-1 pt-1">
                {c('phone') && (
                  <p>
                    {f('phoneLabel') && <span className="text-white/40 text-xs">{f('phoneLabel')} </span>}
                    {c('phone')}
                  </p>
                )}
                {c('email') && (
                  <p>
                    {f('emailLabel') && <span className="text-white/40 text-xs">{f('emailLabel')} </span>}
                    <a href={`mailto:${c('email')}`} className="hover:text-green-400 transition-colors">{c('email')}</a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          {navLinks.length > 0 && (
            <div>
              {f('navAbout') && (
                <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-green-400 mb-5">{f('navAbout')}</h4>
              )}
              <ul className="space-y-3">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}
                      className="text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 3 — Services */}
          {services.length > 0 && (
            <div>
              {f('servicesHeading') && (
                <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-green-400 mb-5">{f('servicesHeading')}</h4>
              )}
              <ul className="space-y-3">
                {services.map((s, i) => (
                  <li key={i} className="text-sm text-white/60 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0 mt-2" />{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4 — Partners + Copyright */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-green-400 mb-5">Partners</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'YouTube',     bg: '#FF0000' },
                { label: 'Facebook',    bg: '#1877F2' },
                { label: 'TikTok',      bg: '#010101' },
                { label: 'Spotify',     bg: '#1DB954' },
                { label: 'Apple Music', bg: '#FA2D48' },
              ].map(({ label, bg }) => (
                <span key={label}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90 border border-white/10"
                  style={{ backgroundColor: bg + '22' }}>
                  {label}
                </span>
              ))}
            </div>

            {f('copyright') && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 leading-relaxed">{f('copyright')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3 text-xs text-white/30">
          {f('copyright') && <p>{f('copyright')}</p>}
          <div className="flex gap-4">
            {f('navAbout')   && <Link href={`/${lang}/gioi-thieu`} className="hover:text-white/60 transition-colors">{f('navAbout')}</Link>}
            {f('navContact') && <Link href={`/${lang}/lien-he`}    className="hover:text-white/60 transition-colors">{f('navContact')}</Link>}
          </div>
        </div>
      </div>
    </footer>
  )
}
