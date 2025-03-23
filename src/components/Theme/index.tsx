
import React, { createContext, useContext, useState, useEffect } from 'react';
import styles from './Theme.module.css';

/**
 * Available color themes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Color palette configuration
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error: string;
  warning: string;
  success: string;
}

/**
 * Typography scale configuration
 */
export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

/**
 * Theme configuration props
 */
export interface ThemeConfig {
  mode: ThemeMode;
  lightPalette: ColorPalette;
  darkPalette: ColorPalette;
  typography: TypographyScale;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacing: 'compact' | 'normal' | 'relaxed';
}

/**
 * Theme context value interface
 */
interface ThemeContextValue {
  theme: ThemeConfig;
  currentPalette: ColorPalette;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  setMode: (mode: ThemeMode) => void;
}

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  /** Initial theme configuration */
  initialTheme?: Partial<ThemeConfig>;
  /** Child components */
  children: React.ReactNode;
}

// Default theme configuration
const defaultTheme: ThemeConfig = {
  mode: 'system',
  lightPalette: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#1f2937',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  },
  darkPalette: {
    primary: '#60a5fa',
    secondary: '#818cf8',
    accent: '#f472b6',
    background: '#1f2937',
    text: '#f9fafb',
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
  },
  typography: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  borderRadius: 'md',
  spacing: 'normal',
};

// Create theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom hook to access the theme context
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider component that manages theme state and provides it to children
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = {},
  children,
}) => {
  // Merge initial theme with default theme
  const [theme, setThemeState] = useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
  });

  // Determine if system prefers dark mode
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine current palette based on mode
  const currentPalette = (() => {
    if (theme.mode === 'light') return theme.lightPalette;
    if (theme.mode === 'dark') return theme.darkPalette;
    return systemPrefersDark ? theme.darkPalette : theme.lightPalette;
  })();

  // Update theme variables in CSS
  useEffect(() => {
    const root = document.documentElement;

    // Set color variables
    Object.entries(currentPalette).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Set typography variables
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    // Set border radius
    root.style.setProperty('--border-radius', {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
    }[theme.borderRadius]);

    // Set spacing
    root.style.setProperty('--spacing-factor', {
      compact: '0.75',
      normal: '1',
      relaxed: '1.25',
    }[theme.spacing]);

    // Set theme class
    if (theme.mode === 'dark' || (theme.mode === 'system' && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, currentPalette, systemPrefersDark]);

  // Update theme state
  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState(prevTheme => ({
      ...prevTheme,
      ...newTheme,
    }));
  };

  // Update theme mode
  const setMode = (mode: ThemeMode) => {
    setTheme({ mode });
  };

  return (
    <ThemeContext.Provider value={{ theme, currentPalette, setTheme, setMode }}>
      <div className={styles.themeContainer}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/**
 * Theme control panel component for adjusting theme settings
 */
interface ThemeControlProps {
  /** Whether to show the control panel */
  visible?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const ThemeControl: React.FC<ThemeControlProps> = ({
  visible = true,
  className = '',
}) => {
  const { theme, setMode } = useTheme();

  if (!visible) return null;

  return (
    <div className={`${styles.themeControl} ${className}`}>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Theme Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Mode
            </label>
            <div className="flex space-x-2">
              {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMode(mode)}
                  className={`px-3 py-2 text-sm rounded-md ${theme.mode === mode
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeProvider;
