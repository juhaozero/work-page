export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

export const localeLabels: Record<Locale, string> = {
  zh: '中文',
  en: 'EN',
};

export const localeHtmlLang: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
};

export const localeOgLocale: Record<Locale, string> = {
  zh: 'zh_CN',
  en: 'en_US',
};

/** 默认语言无前缀时，getStaticPaths 的 locale 参数 */
export function getLocaleParam(locale: Locale): string | undefined {
  return locale === defaultLocale ? undefined : locale;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
