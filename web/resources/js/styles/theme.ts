// Base color palette
const palette = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    500: '#eab308',
    800: '#854d0e',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    800: '#1e40af',
  },
  purple: {
    500: '#a855f7',
    600: '#9333ea',
  },
  white: '#ffffff',
  black: '#000000',
};

// Shared theme properties (non-color)
const baseTheme = {
  fonts: {
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  spacing: {
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  transitions: {
    fast: '0.1s ease',
    normal: '0.15s ease',
    slow: '0.2s ease',
    smooth: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Light theme
export const lightTheme = {
  ...baseTheme,
  mode: 'light' as const,
  colors: {
    ...palette,
    // Semantic colors for light mode
    background: {
      primary: palette.gray[50],
      secondary: palette.white,
      tertiary: palette.gray[100],
      inverse: palette.gray[900],
    },
    surface: {
      primary: palette.white,
      secondary: palette.gray[50],
      tertiary: palette.gray[100],
      elevated: palette.white,
    },
    border: {
      primary: palette.gray[200],
      secondary: palette.gray[300],
      focus: palette.primary[500],
    },
    text: {
      primary: palette.gray[900],
      secondary: palette.gray[700],
      tertiary: palette.gray[500],
      muted: palette.gray[400],
      inverse: palette.white,
    },
    interactive: {
      hover: palette.gray[100],
      active: palette.gray[200],
      selected: palette.primary[50],
    },
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.03)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.03)',
    card: '0 0 0 1px rgb(0 0 0 / 0.03), 0 2px 4px rgb(0 0 0 / 0.03), 0 12px 24px rgb(0 0 0 / 0.03)',
    button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    input: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
    focus: '0 0 0 3px',
  },
};

// Dark theme
export const darkTheme = {
  ...baseTheme,
  mode: 'dark' as const,
  colors: {
    ...palette,
    // Semantic colors for dark mode
    background: {
      primary: palette.gray[950],
      secondary: palette.gray[900],
      tertiary: palette.gray[800],
      inverse: palette.gray[50],
    },
    surface: {
      primary: palette.gray[900],
      secondary: palette.gray[800],
      tertiary: palette.gray[700],
      elevated: palette.gray[800],
    },
    border: {
      primary: palette.gray[700],
      secondary: palette.gray[600],
      focus: palette.primary[400],
    },
    text: {
      primary: palette.gray[50],
      secondary: palette.gray[300],
      tertiary: palette.gray[400],
      muted: palette.gray[500],
      inverse: palette.gray[900],
    },
    interactive: {
      hover: palette.gray[800],
      active: palette.gray[700],
      selected: `${palette.primary[500]}20`,
    },
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.2)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.2)',
    card: '0 0 0 1px rgb(255 255 255 / 0.05), 0 2px 4px rgb(0 0 0 / 0.2), 0 12px 24px rgb(0 0 0 / 0.3)',
    button: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    input: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    focus: '0 0 0 3px',
  },
};

// Default export for backwards compatibility
export const theme = lightTheme;

// Theme type that supports both light and dark modes
export type Theme = Omit<typeof lightTheme, 'mode'> & { mode: 'light' | 'dark' };
