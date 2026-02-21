import { useLang } from '@/contexts/LanguageContext';

export default function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button onClick={toggle} aria-label="toggle language">
      {lang === 'th' ? 'EN' : 'TH'}
    </button>
  );
}
