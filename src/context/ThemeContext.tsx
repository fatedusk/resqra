import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  useSystemTheme: boolean;
  setUseSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('resqra_theme') as AppTheme;
    return saved || 'dark';
  });

  const [useSystemTheme, setUseSystemThemeState] = useState<boolean>(() => {
    return localStorage.getItem('resqra_use_system_theme') === 'true';
  });

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-liquid-glass', 'dark');

    let activeTheme = theme;
    if (useSystemTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = prefersDark ? 'dark' : 'light';
    }

    if (activeTheme === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else if (activeTheme === 'liquid-glass') {
      root.classList.add('theme-liquid-glass', 'dark');
    } else {
      root.classList.add('theme-light');
    }
  }, [theme, useSystemTheme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('resqra_theme', newTheme);
    if (useSystemTheme) {
      setUseSystemThemeState(false);
      localStorage.setItem('resqra_use_system_theme', 'false');
    }
  };

  const setUseSystemTheme = (val: boolean) => {
    setUseSystemThemeState(val);
    localStorage.setItem('resqra_use_system_theme', String(val));
    if (val) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, useSystemTheme, setUseSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
