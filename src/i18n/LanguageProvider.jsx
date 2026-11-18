import { useEffect, useMemo, useState } from 'react';
import { LanguageContext, STORAGE_KEY, getInitialLanguage, translations } from './context';

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLanguage);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Kaydedilemezse seçim sadece bu ziyarette geçerli olur.
    }
  }, [lang, t]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
