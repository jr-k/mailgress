import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
    // Try direct match first, then try with /index.tsx
    return pages[`./pages/${name}.tsx`] || pages[`./pages/${name}/index.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider>
        <GlobalStyles />
        <App {...props} />
      </ThemeProvider>
    );
  },
  progress: {
    color: '#4F46E5',
  },
});
