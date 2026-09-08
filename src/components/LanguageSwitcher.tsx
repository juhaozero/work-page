import { localeLabels, type Locale } from '../i18n/config';

interface LanguageLink {
  locale: Locale;
  url: string;
}

interface LanguageSwitcherProps {
  locale: Locale;
  ariaLabel: string;
  links: LanguageLink[];
}

/** 终端风格文字切换，不用带边框的 select */
export default function LanguageSwitcher({
  locale,
  ariaLabel,
  links,
}: LanguageSwitcherProps) {
  return (
    <nav className="flex items-center gap-0.5" aria-label={ariaLabel}>
      {links.map(({ locale: code, url }, index) => {
        const active = code === locale;
        return (
          <span key={code} className="inline-flex items-center">
            {index > 0 ? (
              <span className="px-0.5" style={{ color: 'var(--crt-text-dim)' }} aria-hidden="true">
                /
              </span>
            ) : null}
            {active ? (
              <span
                className="btn-filter btn-filter-active min-h-10 inline-flex items-center"
                aria-current="true"
              >
                {localeLabels[code]}
              </span>
            ) : (
              <a
                href={url}
                className="btn-filter btn-filter-inactive min-h-10 inline-flex items-center no-underline"
                style={{ color: 'var(--crt-text-dim)' }}
                hrefLang={code}
              >
                {localeLabels[code]}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export type { LanguageLink };
