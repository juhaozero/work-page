import { useEffect, useState } from 'react';
import type { UITranslations } from '../i18n/ui';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  labels: UITranslations['theme'];
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle({ labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light');

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
