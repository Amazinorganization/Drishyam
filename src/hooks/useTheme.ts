import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';
import { STORAGE_KEYS } from '../services/storage';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        document.body.style.backgroundColor = '#0B0F19';
        document.body.style.color = '#F8FAFC';
      } else {
        root.classList.remove('dark');
        document.body.style.backgroundColor = '#F8FAFC';
        document.body.style.color = '#0F172A';
      }
    };

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark);

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  return { theme, setTheme };
}
