import { defaultLocale, type Locale } from './config';

/** 去掉语言前缀后的站点内路径，例如 `/about`、`/projects/foo` */
export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/en' || normalized.startsWith('/en/')) {
    const rest = normalized.slice(3) || '/';
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return normalized;
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean === '//' ? '/' : clean;
  if (clean === '/') return `/${locale}/`;
  return `/${locale}${clean}`;
}

export function projectDetailPath(locale: Locale, slug: string): string {
  return localizedPath(locale, `/projects/${slug}`);
}

export function aboutPath(locale: Locale): string {
  return localizedPath(locale, '/about');
}

export function homePath(locale: Locale): string {
  return localizedPath(locale, '/');
}
