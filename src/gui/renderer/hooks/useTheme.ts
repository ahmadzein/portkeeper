import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

export type ThemeMode = 'light' | 'dark';

interface ThemeConfig {
  mode: ThemeMode;
  algorithm: typeof theme.defaultAlgorithm | typeof theme.darkAlgorithm;
}

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Load saved theme preference
    const saved = localStorage.getItem('portmanager-theme');
    return (saved as ThemeMode) || 'light';
  });

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    mode: themeMode,
    algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  });

  useEffect(() => {
    // Update theme config when mode changes
    setThemeConfig({
      mode: themeMode,
      algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    });

    // Save preference
    localStorage.setItem('portmanager-theme', themeMode);

    // Update body class for custom CSS
    document.body.className = `theme-${themeMode}`;
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    themeMode,
    themeConfig,
    toggleTheme,
    isDark: themeMode === 'dark',
  };
};