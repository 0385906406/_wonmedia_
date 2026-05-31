import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export const locales = ['vi', 'en', 'ko', 'ja', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'vi'

function getLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language') ?? 'vi'
  const headers = { 'accept-language': acceptLang }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, [...locales], defaultLocale) as Locale
  } catch {
    return defaultLocale
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip _next internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  // Admin auth protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Auth pages: redirect to admin if already logged in
  if (pathname.startsWith('/auth') && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      await jwtVerify(token, secret)
      return NextResponse.redirect(new URL('/admin', request.url))
    } catch {
      // bad token — fall through to auth page
    }
  }

  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // i18n: redirect client routes that lack a locale prefix
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  if (hasLocale) return NextResponse.next()

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
