# PSR Theme Mode

A lightweight, flexible dark/light theme system for React applications with TypeScript support.

## Features

- 🌙 **Dark/Light/System theme support**
- 🎨 **CSS custom properties integration**
- 💾 **Persistent theme storage**
- 🔧 **Highly customizable**
- 📱 **System theme detection**
- ⚡ **Lightweight and performant**
- 🔒 **TypeScript support**
- 🧩 **Framework agnostic CSS**

## Installation

```bash
npm install psr-theme-mode
```

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider, ThemeToggle } from 'psr-theme-mode';
import 'psr-theme-mode/dist/styles.css';

function App() {
  return (
    <ThemeProvider>
      <div className="psr-themed">
        <h1>My App</h1>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 2. Use the theme in your components

```tsx
import React from 'react';
import { useTheme } from 'psr-theme-mode';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

## API Reference

### ThemeProvider

The main provider component that manages theme state.

```tsx
<ThemeProvider
  config={{
    defaultTheme: 'system',
    storageKey: 'my-app-theme',
    themes: ['light', 'dark', 'blue'],
    enableSystem: true,
    attribute: 'data-theme'
  }}
  forcedTheme="dark" // Optional: force a specific theme
>
  {children}
</ThemeProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `ThemeConfig` | `{}` | Theme configuration object |
| `forcedTheme` | `string` | `undefined` | Force a specific theme |
| `children` | `ReactNode` | - | Child components |

#### ThemeConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `defaultTheme` | `Theme` | `'system'` | Default theme when no preference is stored |
| `storageKey` | `string` | `'psr-theme'` | localStorage key for theme persistence |
| `attribute` | `string` | `'data-theme'` | HTML attribute name for theme |
| `enableSystem` | `boolean` | `true` | Enable system theme detection |
| `disableTransitionOnChange` | `boolean` | `false` | Disable transitions during theme changes |
| `selector` | `string` | `'html'` | CSS selector for theme container |
| `themes` | `string[]` | `['light', 'dark']` | Available theme names |
| `mediaQuery` | `string` | `'(prefers-color-scheme: dark)'` | Media query for dark mode detection |

### useTheme Hook

Hook to access and control theme state.

```tsx
const {
  theme,          // Current theme name
  setTheme,       // Function to change theme
  resolvedTheme,  // Actual theme (resolves 'system' to 'light'/'dark')
  themes,         // Array of available themes
  systemTheme,    // System preference ('light' or 'dark')
  forcedTheme     // Forced theme if any
} = useTheme();
```

### ThemeToggle Component

Pre-built theme toggle component.

```tsx
<ThemeToggle
  size="medium"
  showLabels={true}
  lightLabel="Light Mode"
  darkLabel="Dark Mode"
  systemLabel="Auto"
  onThemeChange={(theme) => console.log('Theme changed:', theme)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Toggle button size |
| `showLabels` | `boolean` | `false` | Show theme labels |
| `lightLabel` | `string` | `'Light'` | Label for light theme |
| `darkLabel` | `string` | `'Dark'` | Label for dark theme |
| `systemLabel` | `string` | `'System'` | Label for system theme |
| `onThemeChange` | `(theme: string) => void` | `undefined` | Callback when theme changes |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `CSSProperties` | `{}` | Inline styles |

## CSS Variables

The package provides CSS custom properties for easy theming:

```css
:root {
  --psr-bg-primary: #ffffff;
  --psr-bg-secondary: #f8f9fa;
  --psr-text-primary: #212529;
  --psr-text-secondary: #6c757d;
  --psr-border: #dee2e6;
  --psr-accent: #0d6efd;
  /* ... more variables */
}

[data-theme="dark"] {
  --psr-bg-primary: #1a1a1a;
  --psr-bg-secondary: #2d2d2d;
  --psr-text-primary: #ffffff;
  /* ... dark theme overrides */
}
```

## Utility Functions

### createThemeSystem

Generate CSS for custom themes:

```tsx
import { createThemeSystem } from 'psr-theme-mode';

const css = createThemeSystem({
  light: {
    'primary': '#ffffff',
    'secondary': '#f8f9fa',
    'text': '#212529'
  },
  dark: {
    'primary': '#1a1a1a',
    'secondary': '#2d2d2d',
    'text': '#ffffff'
  }
});

// Inject CSS into your app
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

### Other Utilities

```tsx
import {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  validateThemeConfig
} from 'psr-theme-mode';

// Get system theme preference
const systemTheme = getSystemTheme(); // 'light' | 'dark'

// Manual theme storage
const stored = getStoredTheme('my-theme-key');
setStoredTheme('dark', 'my-theme-key');

// Apply theme manually
applyTheme('dark', { selector: 'body', attribute: 'data-theme' });
```

## Advanced Usage

### Custom Theme Colors

```tsx
import { ThemeProvider, createThemeSystem } from 'psr-theme-mode';

const customThemes = {
  light: {
    primary: '#ffffff',
    secondary: '#f0f0f0',
    accent: '#007bff',
    text: '#333333'
  },
  dark: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#4dabf7',
    text: '#ffffff'
  },
  ocean: {
    primary: '#0f3460',
    secondary: '#16537e',
    accent: '#e94560',
    text: '#ffffff'
  }
};

// Generate and inject CSS
const css = createThemeSystem(customThemes);
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

function App() {
  return (
    <ThemeProvider 
      config={{ 
        themes: ['light', 'dark', 'ocean'],
        defaultTheme: 'light'
      }}
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### Server-Side Rendering (SSR)

```tsx
import { ThemeProvider } from 'psr-theme-mode';

function App({ initialTheme }) {
  return (
    <ThemeProvider 
      config={{ 
        defaultTheme: initialTheme || 'system',
        disableTransitionOnChange: true // Prevent flash
      }}
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### Multiple Theme Instances

```tsx
function App() {
  return (
    <div>
      <ThemeProvider config={{ storageKey: 'header-theme' }}>
        <Header />
      </ThemeProvider>
      
      <ThemeProvider config={{ storageKey: 'main-theme' }}>
        <Main />
      </ThemeProvider>
    </div>
  );
}
```

## Styling Components

### Using CSS Classes

```css
.my-component {
  background-color: var(--psr-bg-primary);
  color: var(--psr-text-primary);
  border: 1px solid var(--psr-border);
}

/* Or use provided utility classes */
.my-card {
  @apply psr-themed-card;
}
```

### Using Styled Components

```tsx
import styled from 'styled-components';

const ThemedCard = styled.div`
  background-color: var(--psr-bg-primary);
  color: var(--psr-text-primary);
  border: 1px solid var(--psr-border);
  padding: 1rem;
  border-radius: 0.5rem;
`;
```

## TypeScript Support

The package is fully typed with TypeScript:

```tsx
import { Theme, ThemeConfig, ThemeContextType } from 'psr-theme-mode';

const config: ThemeConfig = {
  defaultTheme: 'system',
  themes: ['light', 'dark'],
  enableSystem: true
};

function MyComponent() {
  const themeContext: ThemeContextType = useTheme();
  
  const handleThemeChange = (theme: Theme) => {
    themeContext.setTheme(theme);
  };
  
  return <div>...</div>;
}
```

## Browser Support

- Modern browsers with CSS custom properties support
- IE 11+ (with polyfill for CSS custom properties)
- React 16.8+ (hooks support required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License. See [LICENSE](LICENSE) for more information.

## Changelog

### 1.0.0
- Initial release
- ThemeProvider and useTheme hook
- ThemeToggle component
- CSS custom properties
- TypeScript support
- System theme detection
- Local storage persistence