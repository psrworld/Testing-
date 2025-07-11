import { ThemeMode, ThemeConfig, ThemeSystem, MediaQueryList } from './types';

export * from './types';

const DEFAULT_CONFIG: Required<ThemeConfig> = {
  defaultMode: 'system',
  storageKey: 'theme-mode',
  attribute: 'data-theme',
  enableSystem: true,
  disableTransitions: false,
};

export class ThemeModeSystem implements ThemeSystem {
  private config: Required<ThemeConfig>;
  private _theme: ThemeMode;
  private _resolvedTheme: 'light' | 'dark';
  private mediaQuery: MediaQueryList | null = null;
  private subscribers: Set<(theme: ThemeMode, resolvedTheme: 'light' | 'dark') => void> = new Set();
  private mediaQueryListener: EventListener | null = null;

  constructor(config: ThemeConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this._theme = this.getStoredTheme() || this.config.defaultMode;
    this._resolvedTheme = this.resolveTheme(this._theme);
    
    this.initializeMediaQuery();
    this.applyTheme();
  }

  get theme(): ThemeMode {
    return this._theme;
  }

  get resolvedTheme(): 'light' | 'dark' {
    return this._resolvedTheme;
  }

  setTheme(theme: ThemeMode): void {
    this._theme = theme;
    this._resolvedTheme = this.resolveTheme(theme);
    this.saveTheme(theme);
    this.applyTheme();
    this.notifySubscribers();
    this.dispatchEvent();
  }

  toggleTheme(): void {
    const currentResolved = this.resolvedTheme;
    const newTheme = currentResolved === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  subscribe(callback: (theme: ThemeMode, resolvedTheme: 'light' | 'dark') => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  destroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
    this.subscribers.clear();
  }

  private initializeMediaQuery(): void {
    if (!this.config.enableSystem || typeof window === 'undefined') return;

    try {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryListener = () => {
        if (this._theme === 'system') {
          this._resolvedTheme = this.resolveTheme('system');
          this.applyTheme();
          this.notifySubscribers();
          this.dispatchEvent();
        }
      };
      this.mediaQuery.addEventListener('change', this.mediaQueryListener);
    } catch (error) {
      console.warn('Media query not supported:', error);
    }
  }

  private resolveTheme(theme: ThemeMode): 'light' | 'dark' {
    if (theme === 'system') {
      if (this.mediaQuery) {
        return this.mediaQuery.matches ? 'dark' : 'light';
      }
      return 'light'; // fallback
    }
    return theme;
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    if (this.config.disableTransitions) {
      const css = document.createElement('style');
      css.textContent = '*, *::before, *::after { transition: none !important; }';
      document.head.appendChild(css);
      
      // Force reflow
      root.offsetHeight;
      
      setTimeout(() => {
        document.head.removeChild(css);
      }, 1);
    }

    root.setAttribute(this.config.attribute, this._resolvedTheme);
    root.style.colorScheme = this._resolvedTheme;
  }

  private getStoredTheme(): ThemeMode | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      return (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  private saveTheme(theme: ThemeMode): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.config.storageKey, theme);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this._theme, this._resolvedTheme);
      } catch (error) {
        console.error('Error in theme subscriber:', error);
      }
    });
  }

  private dispatchEvent(): void {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('theme-changed', {
      detail: { theme: this._theme, resolvedTheme: this._resolvedTheme }
    });
    window.dispatchEvent(event);
  }
}

// Factory function for easier usage
export function createThemeSystem(config?: ThemeConfig): ThemeSystem {
  return new ThemeModeSystem(config);
}

// Default export
export default createThemeSystem;