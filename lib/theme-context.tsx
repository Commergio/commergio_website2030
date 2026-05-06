'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('commergio-theme') as Theme | null;
    if (stored === 'light') {
      setThemeState('light');
    } else {
      // Force unified brand look: light + gold across the whole website.
      setThemeState('light');
      localStorage.setItem('commergio-theme', 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.add('light');
    root.classList.remove('dark');
  }, [theme, mounted]);

  const setTheme = (t: Theme) => {
    // Keep API stable for existing callers, but lock visual system to light mode.
    setThemeState('light');
    localStorage.setItem('commergio-theme', 'light');
  };

  const toggleTheme = () => setTheme('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
