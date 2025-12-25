import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const getSystemTheme = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      const applyTheme = (theme: Theme) => {
        const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme());
        document.documentElement.classList.toggle('dark', isDark);
        set({ theme, isDark });
      };

      // Initialize theme
      const stored = localStorage.getItem('theme-storage');
      const initialTheme: Theme = stored ? JSON.parse(stored).state?.theme || 'system' : 'system';
      applyTheme(initialTheme);

      // Listen to system theme changes
      if (initialTheme === 'system') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          if (get().theme === 'system') {
            applyTheme('system');
          }
        });
      }

      return {
        theme: initialTheme,
        isDark: initialTheme === 'dark' || (initialTheme === 'system' && getSystemTheme()),
        
        setTheme: (theme: Theme) => {
          applyTheme(theme);
        },
      };
    },
    {
      name: 'theme-storage',
    }
  )
);

