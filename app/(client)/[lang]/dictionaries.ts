import 'server-only'
import type { Locale } from '@/lib/locales'

const dictionaries = {
  vi: () => import('@/dictionaries/vi.json').then((m) => m.default),
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
}

export { type Locale }

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
