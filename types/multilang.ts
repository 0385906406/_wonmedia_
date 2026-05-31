export const LOCALES = ['vi', 'en', 'ko', 'ja', 'zh'] as const
export type LocaleKey = typeof LOCALES[number]
export type MultiLang = Record<LocaleKey, string>

export const LOCALE_META: Record<LocaleKey, { label: string; flag: string; short: string }> = {
  vi: { label: 'Tiếng Việt', flag: '🇻🇳', short: 'VI' },
  en: { label: 'English',    flag: '🇺🇸', short: 'EN' },
  ko: { label: '한국어',      flag: '🇰🇷', short: 'KO' },
  ja: { label: '日本語',      flag: '🇯🇵', short: 'JA' },
  zh: { label: '中文',       flag: '🇨🇳', short: 'ZH' },
}

export function emptyMultiLang(): MultiLang {
  return { vi: '', en: '', ko: '', ja: '', zh: '' }
}
