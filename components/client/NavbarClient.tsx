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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Đóng mobile menu khi click ngoài
  useEffect(() => {
    if (!mobileOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
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

  return (
    <header ref={mobileRef} className={scrolled ? 'wm-header wm-header--scrolled' : 'wm-header'}>
      <div className="wm-header__inner">
        {/* Logo */}
        <Link href={`/${lang}`} className="wm-header__brand">
          <img src={logoUrl || '/logo.png'} alt={brandName || 'WON Media'} className="wm-header__logo" />
          {brandName && (
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff', letterSpacing: '-0.2px', marginLeft: 8 }}>
              {brandName}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="wm-desktop-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`wm-nav-link${isActive ? ' wm-nav-link--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right */}
        <div className="wm-header__right">
          <Suspense>
            <LanguageSwitcher currentLocale={lang as Locale} variant="dark" />
          </Suspense>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/wonmediavn"
            target="_blank"
            rel="noreferrer"
            className="wm-fb-btn"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="wm-mobile-menu-btn"
            aria-label="Menu"
            aria-expanded={mobileOpen}
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

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="wm-mobile-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`wm-mobile-nav__link${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
