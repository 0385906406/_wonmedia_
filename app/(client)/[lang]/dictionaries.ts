import 'server-only'
import type { Locale } from '@/proxy'

const dictionaries = {
  vi: () => import('@/dictionaries/vi.json').then((m) => m.default),
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  ko: () => import('@/dictionaries/ko.json').then((m) => m.default),
  ja: () => import('@/dictionaries/ja.json').then((m) => m.default),
  zh: () => import('@/dictionaries/zh.json').then((m) => m.default),
}

export { type Locale }

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
