import OpenAI from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Answer {
  category: string
  questionIndex: number
  answer: number
  question: string
}

interface SessionState {
  role: string
  currentCategory: number
  currentQuestion: number
  answers: Answer[]
  totalScore: number
  isComplete: boolean
  scores?: { category: string; points: number; maxPoints: number }[]
  userProfile: User
  questions?: { question: string; category: string }[]
}

interface User {
  name: string;
  industry: string;
  numberOfEmployees: number;
  role: string;
  assessmentType: 'quick' | 'detailed';
}

const CATEGORIES = [
  "Digitale Strategie",
  "Digitale Prozesse",
  "Digitale Kundenbeziehung",
  "Digitale Geschäftsmodelle",
  "Digitale Kompetenzen"
]

const QUESTIONS: Record<string, Record<string, { question: string; category: string }[]>> = {
  unternehmer: {
    "Digitale Strategie": [
      {
        question: `Wie stark ist die Digitalisierung in Ihrer Unternehmensstrategie verankert? 🌐

Beispiele:
1️⃣ - Kein digitales Konzept vorhanden.
3️⃣ - Erste digitale Initiativen gestartet.
5️⃣ - Digitalisierung ist zentraler Bestandteil und vollständig umgesetzt.

Bewertungsskala: 1 = niedrig, 5 = hoch.`,
        category: "Digitale Strategie"
      },
      {
        question: `Wie häufig überprüfen Sie Ihre digitale Strategie? 🔍

Beispiele:
1️⃣ - Nie.
3️⃣ - Gelegentlich, z.B. einmal jährlich.
5️⃣ - Regelmäßig und kontinuierlich, z.B. quartalsweise.

Bewertungsskala: 1 = selten, 5 = sehr häufig.`,
        category: "Digitale Strategie"
      },
      {
        question: `Wie integriert ist die Digitalisierung in Ihre Unternehmensziele? 🎯

Beispiele:
1️⃣ - Digitalisierung ist kein Teil der Unternehmensziele.
3️⃣ - Teilweise integriert in einige Ziele.
5️⃣ - Vollständig integriert in alle Unternehmensziele.

Bewertungsskala: 1 = wenig integriert, 5 = vollständig integriert.`,
        category: "Digitale Strategie"
      }
    ],
    "Digitale Prozesse": [
      {
        question: `Wie zufrieden sind Sie mit den digitalen Prozessen in Ihrem Unternehmen? 🔄

Beispiele:
1️⃣ - Prozesse sind überwiegend manuell.
3️⃣ - Etwa die Hälfte der Prozesse ist digitalisiert.
5️⃣ - Alle Prozesse sind vollständig digital und automatisiert.

Bewertungsskala: 1 = sehr unzufrieden, 5 = sehr zufrieden.`,
        category: "Digitale Prozesse"
      },
      {
        question: `Wie gut sind Ihre digitalen Tools in den Geschäftsprozessen integriert? 🛠️

Beispiele:
1️⃣ - Tools sind isoliert und kommunizieren nicht miteinander.
3️⃣ - Einige Tools sind integriert, aber es gibt Lücken.
5️⃣ - Alle digitalen Tools sind nahtlos integriert und kommunizieren effektiv.

Bewertungsskala: 1 = schlecht integriert, 5 = hervorragend integriert.`,
        category: "Digitale Prozesse"
      },
      {
        question: `Wie hoch ist der Automatisierungsgrad Ihrer Geschäftsprozesse? 🤖

Beispiele:
1️⃣ - Keine Automatisierung vorhanden.
3️⃣ - Teilweise automatisierte Prozesse.
5️⃣ - Vollständig automatisierte und optimierte Prozesse.

Bewertungsskala: 1 = keine Automatisierung, 5 = vollständige Automatisierung.`,
        category: "Digitale Prozesse"
      }
    ],
    "Digitale Kundenbeziehung": [
      {
        question: `Wie effektiv nutzen Sie digitale Kanäle zur Kundenkommunikation? 📱

Beispiele:
1️⃣ - Kaum digitale Kanäle genutzt.
3️⃣ - Nutzung einiger digitaler Kanäle, aber nicht effektiv.
5️⃣ - Effektive und umfassende Nutzung digitaler Kanäle zur Kundenkommunikation.

Bewertungsskala: 1 = ineffektiv, 5 = sehr effektiv.`,
        category: "Digitale Kundenbeziehung"
      },
      {
        question: `Wie gut sind Ihre Kundenbeziehungsmanagement-Systeme digitalisiert? 📊

Beispiele:
1️⃣ - Keine digitalen CRM-Systeme genutzt.
3️⃣ - Teilweise digitale CRM-Systeme implementiert.
5️⃣ - Vollständig digitalisierte und integrierte CRM-Systeme.

Bewertungsskala: 1 = schlecht digitalisiert, 5 = hervorragend digitalisiert.`,
        category: "Digitale Kundenbeziehung"
      },
      {
        question: `Wie personalisiert sind Ihre digitalen Marketingstrategien? 🎨

Beispiele:
1️⃣ - Keine Personalisierung in Marketingstrategien.
3️⃣ - Teilweise personalisierte Marketingstrategien.
5️⃣ - Vollständig personalisierte und datengetriebene Marketingstrategien.

Bewertungsskala: 1 = keine Personalisierung, 5 = vollständig personalisiert.`,
        category: "Digitale Kundenbeziehung"
      }
    ],
    "Digitale Geschäftsmodelle": [
      {
        question: `Wie stark sind digitale Geschäftsmodelle in Ihrem Unternehmen implementiert? 💼

Beispiele:
1️⃣ - Keine digitalen Geschäftsmodelle vorhanden.
3️⃣ - Einige digitale Geschäftsmodelle implementiert.
5️⃣ - Vielfältige und vollständig implementierte digitale Geschäftsmodelle.

Bewertungsskala: 1 = sehr schwach, 5 = sehr stark.`,
        category: "Digitale Geschäftsmodelle"
      },
      {
        question: `Wie innovativ sind Ihre digitalen Geschäftsmodelle? 💡

Beispiele:
1️⃣ - Keine Innovation vorhanden.
3️⃣ - Moderat innovativ.
5️⃣ - Hoch innovativ und zukunftsorientiert.

Bewertungsskala: 1 = wenig innovativ, 5 = sehr innovativ.`,
        category: "Digitale Geschäftsmodelle"
      },
      {
        question: `Wie skalierbar sind Ihre digitalen Geschäftsmodelle? 📈

Beispiele:
1️⃣ - Nicht skalierbar.
3️⃣ - Teilweise skalierbar.
5️⃣ - Vollständig skalierbar und wachstumsfähig.

Bewertungsskala: 1 = nicht skalierbar, 5 = vollständig skalierbar.`,
        category: "Digitale Geschäftsmodelle"
      }
    ],
    "Digitale Kompetenzen": [
      {
        question: `Wie gut sind Ihre Mitarbeiter in digitalen Technologien geschult? 👩‍💻👨‍💻

Beispiele:
1️⃣ - Keine Schulungen angeboten.
3️⃣ - Gelegentliche Schulungen für einige Mitarbeiter.
5️⃣ - Regelmäßige und umfassende Schulungen für alle Mitarbeiter.

Bewertungsskala: 1 = schlecht geschult, 5 = hervorragend geschult.`,
        category: "Digitale Kompetenzen"
      },
      {
        question: `Wie gut fördern Sie die digitale Weiterbildung Ihrer Mitarbeiter? 📚

Beispiele:
1️⃣ - Keine Maßnahmen zur Weiterbildung.
3️⃣ - Teilweise geförderte Weiterbildungsmaßnahmen.
5️⃣ - Umfassende und kontinuierliche Förderung der digitalen Weiterbildung.

Bewertungsskala: 1 = wenig gefördert, 5 = stark gefördert.`,
        category: "Digitale Kompetenzen"
      },
      {
        question: `Wie hoch ist die digitale Affinität Ihrer Führungskräfte? 🧠

Beispiele:
1️⃣ - Geringe Affinität, wenig Interesse an digitalen Themen.
3️⃣ - Moderate Affinität, gelegentliches Interesse.
5️⃣ - Hohe Affinität, starkes Interesse und aktive Förderung digitaler Themen.

Bewertungsskala: 1 = gering, 5 = hoch.`,
        category: "Digitale Kompetenzen"
      }
    ]
  }
}

// Funktion zum Initialisieren einer neuen Session
async function initializeSession({ userProfile, type }: { userProfile: User, type: 'quick' | 'detailed' }) {
  const role = userProfile.role || 'unternehmer';
  
  // Sammle alle Fragen aus allen Kategorien
  let allQuestions: { question: string; category: string }[] = [];
  
  Object.keys(QUESTIONS[role]).forEach(category => {
    const categoryQuestions = type === 'quick'
      ? QUESTIONS[role][category].filter((_, i) => i % 2 === 0)  // Nur jede zweite Frage für Express
      : QUESTIONS[role][category];
    
    allQuestions = [...allQuestions, ...categoryQuestions];
  });

  const initialSessionState: SessionState = {
    role: role,
    currentCategory: 0,
    currentQuestion: 0,
    answers: [],
    totalScore: 0,
    isComplete: false,
    questions: allQuestions,
    userProfile: {
      ...userProfile,
      role
    }
  };

  return initialSessionState;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API Request received:', {
    method: req.method,
    body: req.body
  });

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Diese Methode ist nicht erlaubt.'
    });
  }

  try {
    const { type, userProfile } = req.body;

    console.log('Processing request with:', { type, userProfile });

    // Validiere den Request-Typ
    if (type !== 'INIT_QUESTIONS') {
      return res.status(400).json({
        error: 'Invalid request type',
        message: 'Ungültiger Request-Typ.'
      });
    }

    // Validiere das User-Profil
    if (!userProfile) {
      console.log('Missing user profile');
      return res.status(400).json({ 
        error: 'Missing user profile',
        message: 'Benutzerprofil fehlt.'
      });
    }

    if (type === 'INIT_QUESTIONS') {
      // Initialisiere die Session mit den Fragen
      const session = await initializeSession({ 
        userProfile, 
        type: userProfile.assessmentType 
      });
      
      // Gebe die initialisierte Session zurück
      return res.status(200).json({
        success: true,
        session,
        message: 'Session erfolgreich initialisiert.'
      });
    }

  } catch (error) {
    console.error('Digital Fit Check API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
    });
  }
}
