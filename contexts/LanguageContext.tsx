import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'th' | 'en';

type Dict = Record<string, { th: string; en: string }>;

const dict: Dict = {
  brand: { th: 'ไทป์เที่ยวไทย', en: 'TypeTeawThai' },
  login: { th: 'เข้าสู่ระบบ', en: 'Login' },
  register: { th: 'สมัครสมาชิก', en: 'Register' },
  logout: { th: 'ออกจากระบบ', en: 'Logout' },
  emailOrUsername: { th: 'อีเมลหรือชื่อผู้ใช้', en: 'Email or username' },
  password: { th: 'รหัสผ่าน', en: 'Password' },
  start: { th: 'เริ่มทำแบบทดสอบ', en: 'Start quiz' },
  selectRegion: { th: 'เลือกภูมิภาค', en: 'Select region' },
  loading: { th: 'กำลังโหลด…', en: 'Loading…' },
  back: { th: 'ย้อนกลับ', en: 'Back' },
  next: { th: 'ถัดไป', en: 'Next' },
  finish: { th: 'จบแบบทดสอบ', en: 'Finish' },
  chooseFirst: { th: 'กรุณาเลือกคำตอบก่อน', en: 'Please choose an answer first' },
  results: { th: 'ผลลัพธ์ที่แนะนำ', en: 'Your recommendations' },
  profile: { th: 'โปรไฟล์ความชอบ', en: 'Preference profile' },
  recommendedProvinces: { th: 'จังหวัดที่แนะนำ', en: 'Recommended provinces' },
  recommendedLocations: { th: 'สถานที่แนะนำ', en: 'Recommended locations' },
  viewHistory: { th: 'ดูประวัติ', en: 'View history' },
  again: { th: 'ทำแบบทดสอบอีกครั้ง', en: 'Take again' },
  history: { th: 'ประวัติ', en: 'History' },
  historyTitle: { th: 'ประวัติการทำแบบทดสอบ', en: 'Quiz history' },
  view: { th: 'ดูรายละเอียด', en: 'View' },

  envMissingTitle: {
    th: 'ยังไม่ได้ตั้งค่า Supabase',
    en: 'Supabase not configured'
  },
  envMissingBody: {
    th: 'กรุณาสร้างไฟล์ .env.local และใส่ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY แล้วรีสตาร์ท npm run dev',
    en: 'Please create .env.local with NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY then restart npm run dev',
  },

  // ===== Home Page Text =====
  homeIntro1: {
    th: 'บางครั้ง…',
    en: 'Sometimes…',
  },
  homeIntro2: {
    th: 'การเดินทางที่ดีที่สุด',
    en: 'The best journeys',
  },
  homeIntro3: {
    th: 'อาจไม่ได้เริ่มจากการเลือกสถานที่',
    en: 'don’t begin with choosing a destination',
  },
  homeIntro4: {
    th: 'แต่อาจเริ่มจากการรู้จักตัวเอง',
    en: 'but with understanding yourself',
  },

  homeReflection1: {
    th: 'ในช่วงเวลานี้',
    en: 'At this moment',
  },
  homeReflection2: {
    th: 'คุณกำลังต้องการความสงบ',
    en: 'are you seeking peace',
  },
  homeReflection3: {
    th: 'ความตื่นเต้น',
    en: 'excitement',
  },
  homeReflection4: {
    th: 'หรือแรงบันดาลใจใหม่ ๆ กันแน่',
    en: 'or a new spark of inspiration?',
  },

  homeEnding1: {
    th: 'และบางที',
    en: 'And maybe',
  },
  homeEnding2: {
    th: 'สถานที่ที่เหมาะที่สุด',
    en: 'the right place',
  },
  homeEnding3: {
    th: 'อาจไม่ใช่ที่ที่ไกลที่สุด',
    en: 'is not the farthest one',
  },
  homeEnding4: {
    th: 'แต่คือที่ที่ “เข้ากับตัวคุณตอนนี้” มากที่สุด',
    en: 'but the one that fits who you are right now',
  },

  homeTerms: {
    th: 'เมื่อเริ่มต้น คุณยอมรับเงื่อนไขการใช้งาน',
    en: 'By starting, you agree to our Terms & Conditions',
  },
};

type Ctx = {
  lang: Lang;
  toggle: () => void;
  t: (key: keyof typeof dict) => string;
};

const LanguageContext = createContext<Ctx | null>(null);
const LS_KEY = 'tt_lang_v1';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('th');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved === 'th' || saved === 'en') setLang(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const toggle = () => setLang((p) => (p === 'th' ? 'en' : 'th'));
  const t = (key: keyof typeof dict) => dict[key][lang];

  const value = useMemo(() => ({ lang, toggle, t }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}