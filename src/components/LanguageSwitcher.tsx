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

export default function LanguageSwitcher({ locale, ariaLabel, links }: LanguageSwitcherProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    const target = links.find((link) => link.locale === nextLocale);
    if (target && target.locale !== locale) {
      window.location.assign(target.url);
    }
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label={ariaLabel}
      className="select-terminal text-xs"
    >
      {links.map(({ locale: code }) => (
        <option key={code} value={code}>
          {localeLabels[code]}
        </option>
      ))}
    </select>
  );
}

export type { LanguageLink };
