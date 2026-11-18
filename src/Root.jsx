import { Suspense, lazy } from 'react';
import App from './App.jsx';
import LanguageProvider from './i18n/LanguageProvider.jsx';

// /ziyaretler: şifreli analiz paneli. Ayrı dosyada yüklenir, ana siteyi ağırlaştırmaz.
const Ziyaretler = lazy(() => import('./pages/Ziyaretler.jsx'));

export default function Root() {
  const panelMi = window.location.pathname.replace(/\/+$/, '') === '/ziyaretler';
  if (panelMi) {
    return (
      <Suspense fallback={null}>
        <Ziyaretler />
      </Suspense>
    );
  }
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}
