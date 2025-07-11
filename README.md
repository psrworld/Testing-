# Theme Mode System

A lightweight, flexible dark/light theme system with TypeScript support and zero dependencies.

## Features

- 🌙 **Dark/Light/System modes** - Full support for user preference detection
- 🔄 **Automatic switching** - Responds to system preference changes
- 💾 **Persistent storage** - Remembers user choice across sessions
- 🎨 **CSS variables** - Complete theming system with utility classes
- 📱 **SSR friendly** - Works with server-side rendering
- 🔧 **TypeScript support** - Full type definitions included
- 🪶 **Zero dependencies** - No external dependencies
- 🎯 **Framework agnostic** - Works with any JavaScript framework

## Installation

```bash
npm install theme-mode-system
```

## Quick Start

### Basic Usage

```javascript
import { createThemeSystem } from 'theme-mode-system';

// Create theme system
const themeSystem = createThemeSystem();

// Set theme
themeSystem.setTheme('dark');

// Toggle between light and dark
themeSystem.toggleTheme();

// Get current theme
console.log(themeSystem.theme); // 'dark'
console.log(themeSystem.resolvedTheme); // 'dark'
```

### With Configuration

```javascript
import { createThemeSystem } from 'theme-mode-system';

const themeSystem = createThemeSystem({
  defaultMode: 'system',
  storageKey: 'my-app-theme',
  attribute: 'data-theme',
  enableSystem: true,
  disableTransitions: false
});
```

### React Integration

```jsx
import React, { useEffect, useState } from 'react';
import { createThemeSystem } from 'theme-mode-system';

function ThemeProvider({ children }) {
  const [themeSystem] = useState(() => createThemeSystem());
  const [theme, setTheme] = useState(themeSystem.theme);

  useEffect(() => {
    const unsubscribe = themeSystem.subscribe((newTheme, resolvedTheme) => {
      setTheme(newTheme);
    });

    return unsubscribe;
  }, [themeSystem]);

  return (
    <div className="theme-bg">
      <button onClick={() => themeSystem.toggleTheme()}>
        Toggle Theme ({theme})
      </button>
      {children}
    </div>
  );
}
```

### Vue Integration

```vue
<template>
  <div class="theme-bg">
    <button @click="toggleTheme">
      Toggle Theme ({{ theme }})
    </button>
    <slot />
  </div>
</template>

<script>
import { createThemeSystem } from 'theme-mode-system';

export default {
  name: 'ThemeProvider',
  data() {
    return {
      themeSystem: null,
      theme: 'system'
    };
  },
  mounted() {
    this.themeSystem = createThemeSystem();
    this.theme = this.themeSystem.theme;
    
    this.unsubscribe = this.themeSystem.subscribe((newTheme) => {
      this.theme = newTheme;
    });
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.themeSystem) {
      this.themeSystem.destroy();
    }
  },
  methods: {
    toggleTheme() {
      this.themeSystem.toggleTheme();
    }
  }
};
</script>
```

## API Reference

### `createThemeSystem(config?)`

Creates a new theme system instance.

#### Parameters

- `config` (optional): Configuration object

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'system'` | Default theme mode |
| `storageKey` | `string` | `'theme-mode'` | localStorage key for persistence |
| `attribute` | `string` | `'data-theme'` | HTML attribute to set on document root |
| `enableSystem` | `boolean` | `true` | Enable system preference detection |
| `disableTransitions` | `boolean` | `false` | Disable CSS transitions during theme change |

### ThemeSystem Instance

#### Properties

- `theme`: Current theme mode (`'light' | 'dark' | 'system'`)
- `resolvedTheme`: Actual applied theme (`'light' | 'dark'`)

#### Methods

- `setTheme(theme)`: Set the theme mode
- `toggleTheme()`: Toggle between light and dark themes
- `subscribe(callback)`: Subscribe to theme changes, returns unsubscribe function
- `destroy()`: Clean up listeners and subscribers

### Events

The system dispatches a `theme-changed` event on the window when the theme changes:

```javascript
window.addEventListener('theme-changed', (event) => {
  console.log('Theme changed:', event.detail);
  // { theme: 'dark', resolvedTheme: 'dark' }
});
```

## CSS Integration

Import the CSS file for pre-built theme variables and utility classes:

```css
@import 'theme-mode-system/dist/styles.css';
```

### CSS Variables

The system provides comprehensive CSS variables for theming:

```css
:root {
  /* Colors */
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #0066cc;
  --color-secondary: #6b7280;
  --color-accent: #f59e0b;
  --color-muted: #f3f4f6;
  --color-border: #e5e7eb;
  
  /* Text colors */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  
  /* Semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Utility Classes

Use pre-built utility classes for common theming needs:

```html
<div class="theme-bg">
  <div class="theme-card">
    <h1 class="theme-text-primary">Hello World</h1>
    <p class="theme-text-secondary">This is themed content</p>
    <button class="theme-button">Click me</button>
    <input class="theme-input" placeholder="Type here..." />
  </div>
</div>
```

## Advanced Usage

### Custom Theme Colors

```javascript
// Define your custom colors
const customColors = {
  light: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529'
  },
  dark: {
    primary: '#4dabf7',
    secondary: '#adb5bd',
    background: '#121212',
    text: '#ffffff'
  }
};

// Apply custom colors with CSS
const applyCustomColors = (theme) => {
  const colors = customColors[theme];
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

// Subscribe to theme changes
themeSystem.subscribe((theme, resolvedTheme) => {
  applyCustomColors(resolvedTheme);
});
```

### Server-Side Rendering

For SSR applications, initialize the theme system after hydration:

```javascript
// Only initialize on client-side
if (typeof window !== 'undefined') {
  const themeSystem = createThemeSystem();
}
```

### Multiple Theme Systems

You can create multiple theme systems with different configurations:

```javascript
const mainTheme = createThemeSystem({
  storageKey: 'main-theme',
  attribute: 'data-main-theme'
});

const editorTheme = createThemeSystem({
  storageKey: 'editor-theme',
  attribute: 'data-editor-theme'
});
```

## Browser Support

- Chrome/Edge: 76+
- Firefox: 69+
- Safari: 12.1+
- iOS Safari: 12.2+

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { ThemeMode, ThemeConfig, ThemeSystem } from 'theme-mode-system';

const config: ThemeConfig = {
  defaultMode: 'system',
  enableSystem: true
};

const themeSystem: ThemeSystem = createThemeSystem(config);
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.# Testing-
