'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { locales, type Locale } from '@/lib/locales'
import { useState, useRef, useEffect } from 'react'

const LANG_LABELS: Record<Locale, { label: string; short: string; flagUrl: string }> = {
  vi: { label: 'Tiếng Việt', short: 'VI', flagUrl: 'https://flagcdn.com/w20/vn.png' },
  en: { label: 'English',    short: 'EN', flagUrl: 'https://flagcdn.com/w20/us.png' },
}

interface Props {
  currentLocale: Locale
  variant?: 'light' | 'dark'
}

export function LanguageSwitcher({ currentLocale, variant = 'light' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(locale: Locale) {
    setOpen(false)
    const segments = pathname.split('/')
    segments[1] = locale
    const newPath = segments.join('/') || `/${locale}`
    // BUG-023: giữ nguyên query params khi đổi locale (page, type, ...)
    const qs = searchParams.toString()
    router.push(qs ? `${newPath}?${qs}` : newPath)
  }

  const current = LANG_LABELS[currentLocale]
  const isDark = variant === 'dark'

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 12px',
          borderRadius: '8px',
          border: isDark ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid var(--nic-gray-border)',
          background: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
          fontSize: '13px',
          fontWeight: 600,
          color: isDark ? '#fff' : 'var(--nic-navy-deep)',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, background 0.2s ease',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-primary)',
        }}
        className="wm-lang-btn"
      >
        <img src={current.flagUrl} width={20} height={14} alt={current.label} style={{ borderRadius: 2, objectFit: 'cover' }} />
        <span>{current.short}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: 0.7,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '160px',
            background: isDark ? 'rgba(25,27,36,0.98)' : '#fff',
            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--nic-gray-border)',
            borderRadius: '12px',
            boxShadow: isDark
              ? '0 16px 40px rgba(0,0,0,0.4)'
              : '0 8px 24px -4px rgba(15,76,129,0.12)',
            padding: '6px',
            zIndex: 200,
            listStyle: 'none',
            margin: 0,
            backdropFilter: isDark ? 'blur(12px)' : 'none',
          }}
        >
          {locales.filter(l => l === 'vi' || l === 'en').map((locale) => {
            const item = LANG_LABELS[locale]
            const isActive = locale === currentLocale
            return (
              <li key={locale} role="option" aria-selected={isActive}>
                <button
                  onClick={() => switchLocale(locale)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: isActive
                      ? isDark ? 'rgba(255,105,0,0.15)' : 'var(--nic-indigo-pale)'
                      : 'transparent',
                    color: isActive
                      ? isDark ? 'var(--wm-orange)' : 'var(--nic-indigo-dark)'
                      : isDark ? 'rgba(255,255,255,0.8)' : 'var(--nic-gray-text)',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                    fontFamily: 'var(--font-primary)',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = isDark
                        ? 'rgba(255,255,255,0.07)'
                        : 'var(--nic-gray-light)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <img src={item.flagUrl} width={20} height={14} alt={item.label} style={{ borderRadius: 2, objectFit: 'cover' }} />
                  <span>{item.label}</span>
                  {isActive && (
                    <svg
                      style={{ marginLeft: 'auto', color: isDark ? 'var(--wm-orange)' : 'var(--nic-indigo-dark)' }}
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
