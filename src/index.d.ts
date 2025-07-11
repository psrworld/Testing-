export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  defaultMode?: ThemeMode;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitions?: boolean;
}

export interface ThemeColors {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface ThemeSystemEvents {
  'theme-changed': CustomEvent<{ theme: ThemeMode; resolvedTheme: 'light' | 'dark' }>;
}

export interface ThemeSystem {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  subscribe: (callback: (theme: ThemeMode, resolvedTheme: 'light' | 'dark') => void) => () => void;
  destroy: () => void;
}

export declare class ThemeModeSystem implements ThemeSystem {
  readonly theme: ThemeMode;
  readonly resolvedTheme: 'light' | 'dark';
  
  constructor(config?: ThemeConfig);
  
  setTheme(theme: ThemeMode): void;
  toggleTheme(): void;
  subscribe(callback: (theme: ThemeMode, resolvedTheme: 'light' | 'dark') => void): () => void;
  destroy(): void;
}

export declare function createThemeSystem(config?: ThemeConfig): ThemeSystem;

export default createThemeSystem;

declare global {
  interface WindowEventMap {
    'theme-changed': CustomEvent<{ theme: ThemeMode; resolvedTheme: 'light' | 'dark' }>;
  }
}