import { createContext, useContext } from 'react';
import en from './en';
import tr from './tr';

export const translations = { en, tr };
export const LANGUAGES = ['en', 'tr'];
export const DEFAULT_LANGUAGE = 'en';
export const STORAGE_KEY = 'beysera-lang';

export const LanguageContext = createContext({
  lang: DEFAULT_LANGUAGE,
  t: translations[DEFAULT_LANGUAGE],
  setLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

// Önce kayıtlı seçim, sonra ?lang= parametresi, en son varsayılan (İngilizce).
export function getInitialLanguage() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGUAGES.includes(fromUrl)) return fromUrl;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // localStorage kapalı olabilir; varsayılana düş.
  }
  return DEFAULT_LANGUAGE;
}
