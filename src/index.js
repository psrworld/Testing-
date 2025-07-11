// JavaScript version for non-TypeScript users

const DEFAULT_CONFIG = {
  defaultMode: 'system',
  storageKey: 'theme-mode',
  attribute: 'data-theme',
  enableSystem: true,
  disableTransitions: false,
};

class ThemeModeSystem {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this._theme = this.getStoredTheme() || this.config.defaultMode;
    this._resolvedTheme = this.resolveTheme(this._theme);
    this.mediaQuery = null;
    this.subscribers = new Set();
    this.mediaQueryListener = null;
    
    this.initializeMediaQuery();
    this.applyTheme();
  }

  get theme() {
    return this._theme;
  }

  get resolvedTheme() {
    return this._resolvedTheme;
  }

  setTheme(theme) {
    this._theme = theme;
    this._resolvedTheme = this.resolveTheme(theme);
    this.saveTheme(theme);
    this.applyTheme();
    this.notifySubscribers();
    this.dispatchEvent();
  }

  toggleTheme() {
    const currentResolved = this.resolvedTheme;
    const newTheme = currentResolved === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  destroy() {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
    this.subscribers.clear();
  }

  initializeMediaQuery() {
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

  resolveTheme(theme) {
    if (theme === 'system') {
      if (this.mediaQuery) {
        return this.mediaQuery.matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return theme;
  }

  applyTheme() {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    if (this.config.disableTransitions) {
      const css = document.createElement('style');
      css.textContent = '*, *::before, *::after { transition: none !important; }';
      document.head.appendChild(css);
      
      root.offsetHeight;
      
      setTimeout(() => {
        document.head.removeChild(css);
      }, 1);
    }

    root.setAttribute(this.config.attribute, this._resolvedTheme);
    root.style.colorScheme = this._resolvedTheme;
  }

  getStoredTheme() {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      return (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  saveTheme(theme) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.config.storageKey, theme);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this._theme, this._resolvedTheme);
      } catch (error) {
        console.error('Error in theme subscriber:', error);
      }
    });
  }

  dispatchEvent() {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('theme-changed', {
      detail: { theme: this._theme, resolvedTheme: this._resolvedTheme }
    });
    window.dispatchEvent(event);
  }
}

function createThemeSystem(config) {
  return new ThemeModeSystem(config);
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeModeSystem, createThemeSystem };
  module.exports.default = createThemeSystem;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return { ThemeModeSystem, createThemeSystem };
  });
} else if (typeof window !== 'undefined') {
  window.ThemeModeSystem = ThemeModeSystem;
  window.createThemeSystem = createThemeSystem;
}