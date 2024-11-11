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
      // Fügen Sie weitere Fragen hinzu, falls erforderlich
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
      // Weitere Fragen...
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
      // Weitere Fragen...
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
      // Weitere Fragen...
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
      // Weitere Fragen...
    ]
  }
}

const SYSTEM_PROMPTS = {
  initial: `Du bist ein freundlicher Digital-Berater für Unternehmer.
Format deiner Antworten:
1. Stelle eine klare Frage zur aktuellen Kategorie (max. 2 Sätze)
2. Gib 3 konkrete Beispiele für verschiedene Digitalisierungsgrade:
   - Beispiel für Anfänger (1-2): "Sarah nutzt noch hauptsächlich Papierakten"
   - Beispiel für Fortgeschrittene (3-4): "Thomas verwendet bereits Cloud-Lösungen"
   - Beispiel für Experten (5): "Lisa arbeitet komplett digital"
3. Erkläre die Bewertungsskala kurz (1-5)
4. Füge max. 2 passende Emojis ein`,

  nextQuestion: `Du bist ein freundlicher Digital-Berater für Unternehmer.
Format deiner Antworten:
1. Kurzes, ermutigendes Feedback zur letzten Antwort (1 Satz)
2. Neue Frage mit 3 konkreten Beispielen wie oben
3. Bewertungsskala (1-5)
4. Max. 2 passende Emojis`,

  final: `Du bist ein freundlicher Digital-Berater für Unternehmer.
Format deiner Antworten:
1. Top-Stärke hervorheben (1 Satz)
2. Wichtigstes Verbesserungspotential (1 Satz)
3. Eine konkrete, priorisierte Handlungsempfehlung
4. Positiver Abschluss mit einem Emoji`
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateFinalAnalysis(role: string, answers: Answer[]) {
  try {
    // Formatiere die Antworten für die Analyse
    const formattedAnswers = answers.map(ans => 
      `Kategorie: ${ans.category}\nFrage: ${ans.question}\nBewertung: ${ans.answer}/5`
    ).join('\n\n')

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Du bist ein erfahrener Digital-Berater. Erstelle eine kurze, prägnante Analyse (max. 3 Sätze) basierend auf den Bewertungen. Hebe eine Stärke und eine Verbesserungsmöglichkeit hervor.`
        },
        {
          role: "user",
          content: formattedAnswers
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    return response.choices[0].message.content || "Analyse konnte nicht erstellt werden."
  } catch (error) {
    console.error('OpenAI API error:', error)
    return "Entschuldigung, bei der Erstellung der Analyse ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { type, role = 'unternehmer', sessionState, answer } = req.body

    // Validiere den OpenAI API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing')
      return res.status(500).json({ 
        message: 'Server-Konfigurationsfehler: OpenAI API Key fehlt.'
      })
    }

    if (type === 'INIT_QUESTIONS') {
      const firstCategory = CATEGORIES[0]
      const firstQuestion = QUESTIONS[role][firstCategory][0].question

      const initialSessionState = {
        role: role,
        currentCategory: 0,
        currentQuestion: 0,
        answers: [],
        totalScore: 0,
        isComplete: false
      }

      return res.status(200).json({
        message: firstQuestion,
        sessionState: initialSessionState
      })
    }

    if (type === 'SUBMIT_ANSWER') {
      // Validiere Session State
      if (!sessionState) {
        console.error('Session state is missing')
        return res.status(400).json({ 
          message: 'Ungültiger Sitzungsstatus: Session State fehlt.' 
        })
      }

      const currentSessionState = sessionState
      if (currentSessionState.isComplete) {
        return res.status(400).json({ 
          message: 'Die Sitzung ist bereits abgeschlossen.' 
        })
      }

      const { currentCategory, currentQuestion, answers } = currentSessionState
      
      // Validiere Kategorie
      if (currentCategory >= CATEGORIES.length) {
        console.error('Invalid category index:', currentCategory)
        return res.status(400).json({ 
          message: 'Ungültige Kategorie.' 
        })
      }
      
      const categoryName = CATEGORIES[currentCategory]
      
      // Validiere Fragen
      if (!QUESTIONS['unternehmer'][categoryName]) {
        console.error('Category questions not found:', categoryName)
        return res.status(400).json({ 
          message: 'Fragen für diese Kategorie nicht gefunden.' 
        })
      }
      
      const categoryQuestions = QUESTIONS['unternehmer'][categoryName]

      // Validiere Antwort
      const answerValue = parseInt(String(answer))
      if (isNaN(answerValue) || answerValue < 0 || answerValue > 5) {
        return res.status(400).json({ 
          message: 'Bitte geben Sie eine Zahl zwischen 0 und 5 ein.' 
        })
      }

      try {
        // Punkte hinzufügen und Antwort speichern
        const currentQuestionText = categoryQuestions[currentQuestion].question
        const newAnswer: Answer = {
          category: categoryName,
          questionIndex: currentQuestion,
          answer: answerValue,
          question: currentQuestionText
        }
        const updatedAnswers = [...answers, newAnswer]
        const updatedTotalScore = currentSessionState.totalScore + answerValue

        // Bestimmen, ob es eine nächste Frage in der aktuellen Kategorie gibt
        const nextQuestionIndex = currentQuestion + 1
        if (nextQuestionIndex < categoryQuestions.length) {
          const nextQuestion = categoryQuestions[nextQuestionIndex].question
          const newSessionState: SessionState = {
            ...currentSessionState,
            currentQuestion: nextQuestionIndex,
            answers: updatedAnswers,
            totalScore: updatedTotalScore
          }

          return res.status(200).json({
            message: `Sehr gut! 👍\n\n${nextQuestion}`,
            sessionState: newSessionState
          })
        }

        // Wechsel zur nächsten Kategorie
        const nextCategoryIndex = currentCategory + 1
        if (nextCategoryIndex < CATEGORIES.length) {
          const nextCategory = CATEGORIES[nextCategoryIndex]
          const nextCategoryFirstQuestion = QUESTIONS['unternehmer'][nextCategory][0].question
          const newSessionState: SessionState = {
            ...currentSessionState,
            currentCategory: nextCategoryIndex,
            currentQuestion: 0,
            answers: updatedAnswers,
            totalScore: updatedTotalScore
          }

          return res.status(200).json({
            message: `Gut! Kommen wir zur Kategorie "${nextCategory}".\n\n${nextCategoryFirstQuestion}`,
            sessionState: newSessionState
          })
        }

        // Finale Analyse
        let finalFeedback
        try {
          finalFeedback = await generateFinalAnalysis(currentSessionState.role, updatedAnswers)
        } catch (error) {
          console.error('Error generating final analysis:', error)
          finalFeedback = "Ihre Antworten wurden erfolgreich ausgewertet. Eine detaillierte Analyse senden wir Ihnen per E-Mail zu."
        }

        const newSessionState: SessionState = {
          ...currentSessionState,
          answers: updatedAnswers,
          totalScore: updatedTotalScore,
          isComplete: true,
          scores: updatedAnswers.map(answer => ({
            category: answer.category,
            points: answer.answer,
            maxPoints: 5
          }))
        }

        return res.status(200).json({
          message: `🎉 Geschafft! Ihr Digital Fit Check ist abgeschlossen.\n\n${finalFeedback}\n\nMöchten Sie Ihre detaillierte Auswertung per E-Mail erhalten? 📧`,
          sessionState: newSessionState
        })

      } catch (error) {
        console.error('Error processing answer:', error)
        return res.status(500).json({ 
          message: 'Fehler bei der Verarbeitung Ihrer Antwort.' 
        })
      }
    }

    return res.status(400).json({ 
      message: 'Ungültiger Anfrage-Typ.' 
    })

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}