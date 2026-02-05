import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context Provider
 * Manages dark/light mode and theme preferences
 */
const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [systemPreference, setSystemPreference] = useState('light');

  // Check system preference and saved theme on mount
  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    // Listen for system preference changes
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);

    // Check saved theme preference
    const savedTheme = localStorage.getItem('scramble_theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Use system preference if no saved preference
      setIsDark(mediaQuery.matches);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('scramble_theme', newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme) => {
    const isDarkTheme = theme === 'dark';
    setIsDark(isDarkTheme);
    localStorage.setItem('scramble_theme', theme);
  };

  const resetToSystem = () => {
    setIsDark(systemPreference === 'dark');
    localStorage.removeItem('scramble_theme');
  };

  const value = {
    isDark,
    theme: isDark ? 'dark' : 'light',
    systemPreference,
    toggleTheme,
    setTheme,
    resetToSystem,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};