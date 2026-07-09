import { localeLabels, locales, type Locale } from '../i18n/config';

interface LanguageLink {
  locale: Locale;
  url: string;
}

interface LanguageSwitcherProps {
  locale: Locale;
  ariaLabel: string;
  links: LanguageLink[];
}

export default function LanguageSwitcher({ locale, ariaLabel, links }: LanguageSwitcherProps) {
  return (
    <nav className="flex items-center gap-1" aria-label={ariaLabel}>
      {links.map(({ locale: code, url }) => {
        const isActive = code === locale;

        return (
          <a
            key={code}
            href={url}
            hrefLang={code}
            lang={code}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'btn-filter text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]',
              isActive ? 'btn-filter-active' : 'btn-filter-inactive',
            ].join(' ')}
          >
            [{localeLabels[code]}]
          </a>
        );
      })}
    </nav>
  );
}

export { locales };
export type { LanguageLink };
