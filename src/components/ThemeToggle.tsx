import { useEffect, useState } from 'react';
import type { UITranslations } from '../i18n/ui';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  labels: UITranslations['theme'];
}

/** 暗色为首选；仅 localStorage 显式为 light 时用亮色 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
}

export default function ThemeToggle({ labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      className="btn-filter focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
    >
      {theme === 'dark' ? labels.light : labels.dark}
    </button>
  );
}
