export const LOCALES = ['vi', 'en'] as const
export const ADMIN_LOCALES: readonly LocaleKey[] = ['vi', 'en']
export type LocaleKey = typeof LOCALES[number]
export type MultiLang = Record<LocaleKey, string>

export const LOCALE_META: Record<LocaleKey, { label: string; flag: string; short: string }> = {
  vi: { label: 'Tiếng Việt', flag: '🇻🇳', short: 'VI' },
  en: { label: 'English',    flag: '🇺🇸', short: 'EN' },
}

export function emptyMultiLang(): MultiLang {
  return { vi: '', en: '' }
}
