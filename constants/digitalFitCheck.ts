export const STEPS = {
  WELCOME: 'welcome',
  NAME: 'name',
  INDUSTRY: 'industry',
  EMPLOYEES: 'employees',
  ASSESSMENT_TYPE: 'assessment-type',
  CHECK: 'check',
  COMPLETE: 'complete'
} as const;

export const MESSAGES = {
  WELCOME: {
    TITLE: 'Willkommen beim Digital Fit Check! 👋',
    DESCRIPTION: 'Finden Sie heraus, wie digital Ihr Unternehmen bereits aufgestellt ist und welche Chancen die Digitalisierung für Sie bereithält! ✨'
  },
  SUCCESS: {
    ASSESSMENT_COMPLETE: '🎉 Vielen Dank für Ihre Teilnahme! Ihre Ergebnisse werden jetzt ausgewertet...',
    PROFILE_CREATED: 'Perfekt! 🎉 Ihre {type}-Analyse beginnt jetzt...'
  },
  ERROR: {
    INVALID_PROFILE: 'Bitte füllen Sie alle Felder korrekt aus.',
    SERVER_ERROR: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    INVALID_RESPONSE: 'Ungültige Antwort vom Server',
    MISSING_DATA: 'Erforderliche Daten fehlen'
  },
  ASSESSMENT: {
    EXPRESS: {
      TITLE: 'Express Check (ca. 5 Minuten)',
      DESCRIPTION: 'Schnelle Einschätzung Ihres digitalen Reifegrads'
    },
    DETAILED: {
      TITLE: 'Detaillierte Analyse (10-15 Minuten)',
      DESCRIPTION: 'Umfassende Analyse mit detaillierten Handlungsempfehlungen'
    }
  }
} as const;

export const CATEGORIES = [
  'Digitale Strategie',
  'Digitale Prozesse',
  'Digitale Kundenerfahrung',
  'Digitale Geschäftsmodelle',
  'Digitale Organisation'
] as const;

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  LABELS: {
    1: 'Sehr niedrig',
    2: 'Niedrig',
    3: 'Mittel',
    4: 'Hoch',
    5: 'Sehr hoch'
  }
} as const;
