import { ReactNode, CSSProperties } from 'react';

export type Theme = 'light' | 'dark' | 'system' | string;

export interface ThemeConfig {
  /**
   * Default theme to use
   * @default 'system'
   */
  defaultTheme?: string;
  
  /**
   * Key used to store theme in localStorage
   * @default 'psr-theme'
   */
  storageKey?: string;
  
  /**
   * HTML attribute to set on the target element
   * @default 'data-theme'
   */
  attribute?: string;
  
  /**
   * Whether to enable system theme detection
   * @default true
   */
  enableSystem?: boolean;
  
  /**
   * Disable CSS transitions when changing themes
   * @default false
   */
  disableTransitionOnChange?: boolean;
  
  /**
   * CSS selector for the element to apply theme to
   * @default 'html'
   */
  selector?: string;
  
  /**
   * Available theme names
   * @default ['light', 'dark']
   */
  themes?: string[];
  
  /**
   * Media query for detecting system theme
   * @default '(prefers-color-scheme: dark)'
   */
  mediaQuery?: string;
}

export interface ThemeProviderProps {
  children: ReactNode;
  config?: ThemeConfig;
  forcedTheme?: string;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
  themes: string[];
  forcedTheme?: string;
  systemTheme: 'light' | 'dark';
}

export interface ThemeToggleProps {
  className?: string;
  style?: CSSProperties;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  lightLabel?: string;
  darkLabel?: string;
  systemLabel?: string;
  onThemeChange?: (theme: string) => void;
}