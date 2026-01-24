// Configure i18next with English, Marathi, and Hindi translations
// Set English as default language
// Export initialized i18n instance
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import mrTranslations from './locales/mr.json';
import hiTranslations from './locales/hi.json';
// Restore language from localStorage or default to English
const storedLang = (typeof window !== 'undefined' && window.localStorage)
  ? localStorage.getItem('lang') || 'en'
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      mr: { translation: mrTranslations },
      hi: { translation: hiTranslations },
    },
    lng: storedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Persist language selection
i18n.on('languageChanged', (lng) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lang', lng);
    }
  } catch {
    // ignore storage errors
  }
});

export default i18n;