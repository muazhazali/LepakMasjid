import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'bm';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Simple translation function - will be enhanced with i18n files
const translations: Record<string, Record<Language, string>> = {
  'app.name': { en: 'LepakMasjid', bm: 'LepakMasjid' },
  'nav.explore': { en: 'Explore', bm: 'Terokai' },
  'nav.contribute': { en: 'Contribute', bm: 'Sumbang' },
  'nav.about': { en: 'About', bm: 'Tentang' },
  'nav.add_mosque': { en: 'Add Mosque', bm: 'Tambah Masjid' },
  'auth.login': { en: 'Login', bm: 'Log Masuk' },
  'auth.logout': { en: 'Logout', bm: 'Log Keluar' },
  'auth.register': { en: 'Register', bm: 'Daftar' },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => {
      // Detect language from URL or browser
      const detectLanguage = (): Language => {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'bm' || langParam === 'en') {
          return langParam;
        }
        
        // Check localStorage
        const stored = localStorage.getItem('language');
        if (stored === 'bm' || stored === 'en') {
          return stored;
        }
        
        // Browser detection
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ms')) {
          return 'bm';
        }
        
        return 'en';
      };

      return {
        language: detectLanguage(),
        
        setLanguage: (lang: Language) => {
          set({ language: lang });
          
          // Update URL parameter
          const url = new URL(window.location.href);
          url.searchParams.set('lang', lang);
          window.history.replaceState({}, '', url.toString());
          
          // Persist to localStorage (handled by persist middleware)
        },
        
        t: (key: string) => {
          const lang = get().language;
          return translations[key]?.[lang] || key;
        },
      };
    },
    {
      name: 'language-storage',
    }
  )
);

