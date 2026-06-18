'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from '@/app/(client)/[lang]/language-switcher'
import type { Locale } from '@/proxy'

interface NavItem {
  href: string
  label: string
}

interface Props {
  lang: string
  navItems: NavItem[]
  loginLabel: string
  isLoggedIn?: boolean
  logoUrl?: string
  brandName?: string
}

export function NavbarClient({ lang, navItems, loginLabel, isLoggedIn = false, logoUrl, brandName }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`

  // Scroll listener — chỉ cần khi ở trang chủ
  useEffect(() => {
    if (!isHome) return
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // Click outside / Esc để đóng mobile menu
  useEffect(() => {
    if (!mobileOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMobileOpen(false)
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [mobileOpen])

  // Trang chủ chưa scroll → trong suốt; đã scroll hoặc trang khác → xám
  // Chữ luôn trắng vì nền xám đủ tối
  const transparent = isHome && !scrolled
  const navBg      = transparent ? 'transparent' : 'rgba(157,166,177,0.95)'
  const textColor   = 'rgba(255,255,255,0.92)'
  const iconColor   = 'rgba(255,255,255,0.78)'
  const borderColor = transparent ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.28)'

  return (
    <>
      {/* Luôn giữ mobile drawer navy + chữ trắng */}
      <style>{`
        @media (max-width: 1180px) {
          .qp-topbar .qp-nav {
            background: rgba(6,35,64,0.97) !important;
            border-bottom-color: rgba(255,255,255,0.1) !important;
          }
          .qp-topbar .qp-nav__link,
          .qp-topbar .qp-nav__btn {
            color: rgba(255,255,255,0.85) !important;
          }
          .qp-topbar .qp-nav__link.is-active,
          .qp-topbar .qp-nav__btn.is-active {
            background: rgba(0,169,143,0.15) !important;
            color: #fff !important;
          }
        }
      `}</style>
      <header
        ref={ref}
        className="qp-topbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: navBg,
          backdropFilter: transparent ? 'none' : 'blur(12px)',
          borderBottomColor: transparent ? 'transparent' : undefined,
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="qp-topbar__inner container">

          {/* Brand */}
          <Link href={`/${lang}`} className="qp-brand" style={{ textDecoration: 'none' }}>
            <div className="qp-brand__mark" style={{ width: 120, height: 'auto' }}>
              <img
                src={logoUrl || '/logo.png'}
                alt={brandName || 'WON Media'}
                style={{
                  width: 120,
                  height: 'auto',
                  objectFit: 'contain',
                  filter: transparent ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            </div>
            {brandName && (
              <div className="qp-brand__text">
                <span className="qp-brand__name" style={{ color: textColor }}>{brandName}</span>
              </div>
            )}
          </Link>

          {/* Nav */}
          <nav className={`qp-nav${mobileOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== `/${lang}` && pathname.startsWith(item.href + '/'))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`qp-nav__link${isActive ? ' is-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ color: textColor }}
                >
                  {item.label}
                </Link>
              )
            })}
            {!isLoggedIn && (
              <Link href={`/${lang}/dang-nhap`} className="qp-nav__login" onClick={() => setMobileOpen(false)}>
                {loginLabel} <span className="qp-login__arrow">→</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="qp-topbar__actions">
            <Suspense>
              <LanguageSwitcher currentLocale={lang as Locale} variant="dark" />
            </Suspense>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/wonmediavn"
              target="_blank"
              rel="noreferrer"
              className="qp-icon-btn"
              aria-label="Facebook"
              style={{ color: iconColor }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {!isLoggedIn && (
              <Link
                href={`/${lang}/dang-nhap`}
                className="qp-login"
                style={{ color: textColor, borderColor }}
              >
                {loginLabel} <span className="qp-login__arrow">→</span>
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="qp-hamburger"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              style={{ color: iconColor, borderColor }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                {mobileOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
