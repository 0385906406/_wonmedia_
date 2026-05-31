'use client'

import { useEffect, useState } from 'react'
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
}

export function NavbarClient({ lang, navItems, loginLabel }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={scrolled ? 'wm-header wm-header--scrolled' : 'wm-header'}>
      <div className="wm-header__inner">
        {/* Logo */}
        <a href={`/${lang}`} className="wm-header__brand">
          <img src="/logo.png" alt="WON Media" className="wm-header__logo" />
        </a>

        {/* Desktop Nav - centered */}
        <nav className="wm-desktop-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="wm-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="wm-header__right">
          {/* Language Switcher */}
          <LanguageSwitcher currentLocale={lang as Locale} variant="dark" />

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

          {/* Login */}
          <a href="/auth/login" className="wm-login-btn">
            {loginLabel}
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="wm-mobile-menu-btn"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="wm-mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="wm-mobile-nav__link"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
