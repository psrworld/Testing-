import { ThemeModeSystem, createThemeSystem } from '../index';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock matchMedia
const matchMediaMock = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
});

describe('ThemeModeSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
  });

  describe('constructor', () => {
    it('should create with default config', () => {
      const themeSystem = new ThemeModeSystem();
      expect(themeSystem.theme).toBe('system');
      expect(themeSystem.resolvedTheme).toBe('light');
    });

    it('should create with custom config', () => {
      const themeSystem = new ThemeModeSystem({
        defaultMode: 'dark',
        storageKey: 'custom-theme',
      });
      expect(themeSystem.theme).toBe('dark');
      expect(themeSystem.resolvedTheme).toBe('dark');
    });

    it('should load stored theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const themeSystem = new ThemeModeSystem();
      expect(themeSystem.theme).toBe('dark');
      expect(themeSystem.resolvedTheme).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should set theme and save to localStorage', () => {
      const themeSystem = new ThemeModeSystem();
      themeSystem.setTheme('dark');
      
      expect(themeSystem.theme).toBe('dark');
      expect(themeSystem.resolvedTheme).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
    });

    it('should notify subscribers when theme changes', () => {
      const themeSystem = new ThemeModeSystem();
      const callback = jest.fn();
      themeSystem.subscribe(callback);
      
      themeSystem.setTheme('dark');
      
      expect(callback).toHaveBeenCalledWith('dark', 'dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const themeSystem = new ThemeModeSystem({ defaultMode: 'light' });
      themeSystem.toggleTheme();
      
      expect(themeSystem.theme).toBe('dark');
      expect(themeSystem.resolvedTheme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const themeSystem = new ThemeModeSystem({ defaultMode: 'dark' });
      themeSystem.toggleTheme();
      
      expect(themeSystem.theme).toBe('light');
      expect(themeSystem.resolvedTheme).toBe('light');
    });
  });

  describe('subscribe', () => {
    it('should add and remove subscribers', () => {
      const themeSystem = new ThemeModeSystem();
      const callback = jest.fn();
      const unsubscribe = themeSystem.subscribe(callback);
      
      themeSystem.setTheme('dark');
      expect(callback).toHaveBeenCalledTimes(1);
      
      unsubscribe();
      themeSystem.setTheme('light');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('system theme', () => {
    it('should resolve system theme based on media query', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      const themeSystem = new ThemeModeSystem({ defaultMode: 'system' });
      expect(themeSystem.resolvedTheme).toBe('dark');
    });

    it('should update when system preference changes', () => {
      const mediaQueryListener = jest.fn();
      const mockMediaQuery = {
        matches: false,
        addEventListener: jest.fn((event, listener) => {
          if (event === 'change') {
            mediaQueryListener.mockImplementation(listener);
          }
        }),
        removeEventListener: jest.fn(),
      };
      
      matchMediaMock.mockReturnValue(mockMediaQuery);
      
      const themeSystem = new ThemeModeSystem({ defaultMode: 'system' });
      const callback = jest.fn();
      themeSystem.subscribe(callback);
      
      // Simulate system preference change
      mockMediaQuery.matches = true;
      mediaQueryListener();
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should clean up listeners and subscribers', () => {
      const removeEventListener = jest.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener,
      });
      
      const themeSystem = new ThemeModeSystem();
      const callback = jest.fn();
      themeSystem.subscribe(callback);
      
      themeSystem.destroy();
      
      expect(removeEventListener).toHaveBeenCalled();
      
      // Should not notify after destroy
      themeSystem.setTheme('dark');
      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe('createThemeSystem', () => {
  it('should create a theme system instance', () => {
    const themeSystem = createThemeSystem();
    expect(themeSystem).toBeInstanceOf(ThemeModeSystem);
  });

  it('should create with custom config', () => {
    const themeSystem = createThemeSystem({ defaultMode: 'dark' });
    expect(themeSystem.theme).toBe('dark');
  });
});