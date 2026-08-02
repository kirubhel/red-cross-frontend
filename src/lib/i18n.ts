export type Language = 'en' | 'am' | 'om';

export interface TranslationDictionary {
  nav: {
    home: string;
    volunteers: string;
    memberships: string;
    payments: string;
    reports: string;
    settings: string;
    language: string;
  };
  volunteers: {
    title: string;
    emergencyReadiness: string;
    incentivePoints: string;
    rankTier: string;
    verifySkill: string;
  };
  payments: {
    title: string;
    idempotencyKey: string;
    payWithTelebirr: string;
    payWithCBE: string;
  };
}

const dictionaries: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      volunteers: 'Volunteers',
      memberships: 'Memberships',
      payments: 'Payments & Billing',
      reports: 'Analytics & Reports',
      settings: 'Settings',
      language: 'Language',
    },
    volunteers: {
      title: 'Volunteer Management & Deployment',
      emergencyReadiness: 'Emergency Readiness Mapping',
      incentivePoints: 'Incentive Points',
      rankTier: 'Rank Tier',
      verifySkill: 'Verify Skill Certification',
    },
    payments: {
      title: 'Fee Collection & Gateways',
      idempotencyKey: 'Idempotency Protection Active',
      payWithTelebirr: 'Pay via Telebirr',
      payWithCBE: 'Pay via CBE Birr',
    },
  },
  am: {
    nav: {
      home: 'መነሻ',
      volunteers: 'በጎ ፈቃደኞች',
      memberships: 'አባልነት',
      payments: 'ክፍያ እና ቢሊንግ',
      reports: 'ሪፖርቶች',
      settings: 'ቅንብሮች',
      language: 'ቋንቋ',
    },
    volunteers: {
      title: 'የበጎ ፈቃደኞች አስተዳደር እና ስምሪት',
      emergencyReadiness: 'የአደጋ ጊዜ ዝግጁነት ካርታ',
      incentivePoints: 'የማበረታቻ ነጥቦች',
      rankTier: 'የደረጃ ማዕረግ',
      verifySkill: 'የክህሎት ምስክር ወረቀት ማረጋገጫ',
    },
    payments: {
      title: 'የክፍያ መሰብሰቢያ ጣቢያ',
      idempotencyKey: 'የተደጋገመ ክፍያ መከላከያ ንቁ ነው',
      payWithTelebirr: 'በቴሌብር ይክፈሉ',
      payWithCBE: 'በሲቢኢ ብር ይክፈሉ',
    },
  },
  om: {
    nav: {
      home: 'Manneen',
      volunteers: 'Tajaajiltoota',
      memberships: 'Miseensummaa',
      payments: 'Kaffaltii',
      reports: 'Gabaasa',
      settings: 'Sajaa',
      language: 'Afaan',
    },
    volunteers: {
      title: 'Bulchiinsa Tajaajiltootaa',
      emergencyReadiness: 'Karta Ariifachiisaa',
      incentivePoints: 'Qabxii Kakka\'umsaa',
      rankTier: 'Sadarkaa',
      verifySkill: 'Ragaa Mirkaneessuu',
    },
    payments: {
      title: 'Sirna Kaffaltii',
      idempotencyKey: 'Ittisa Kaffaltii',
      payWithTelebirr: 'Telebirr n Kaffalaa',
      payWithCBE: 'CBE Birr n Kaffalaa',
    },
  },
};

export function getDictionary(lang: Language): TranslationDictionary {
  return dictionaries[lang] || dictionaries.en;
}
