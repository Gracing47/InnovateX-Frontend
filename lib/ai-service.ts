import { openai, AIResponse } from './openai';
import { Industry, Question } from './questions';

interface AnalysisRequest {
  industry: string;
  answers: {
    question: string;
    answer: string;
    points: number;
  }[];
  score: number;
}

export async function analyzeDigitalFitness(request: AnalysisRequest): Promise<AIResponse> {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback response when no API key is available
    return {
      response: `Basierend auf Ihrer Gesamtpunktzahl von ${request.score}% hier eine generelle Einschätzung:

## Analyse
${request.score < 30 
  ? 'Sie stehen noch am Anfang Ihrer digitalen Transformation. Es gibt viele Möglichkeiten für Verbesserungen.'
  : request.score < 60 
  ? 'Sie sind auf einem guten Weg zur Digitalisierung. Einige Bereiche können noch optimiert werden.'
  : 'Sie sind bereits sehr gut digitalisiert! Fokussieren Sie sich auf die Optimierung bestehender Systeme.'}

## Handlungsempfehlungen
1. Erstellen Sie eine digitale Roadmap für Ihr Unternehmen
2. Priorisieren Sie die wichtigsten Digitalisierungsprojekte
3. Schulen Sie Ihre Mitarbeiter in digitalen Kompetenzen

## Nächste Schritte
Lassen Sie sich von einem Digitalisierungsberater unterstützen, um einen detaillierten Aktionsplan zu erstellen.`
    };
  }

  try {
    const prompt = `Als Digitalisierungsexperte, analysiere bitte die folgenden Antworten für ein Unternehmen aus der Branche ${request.industry}:

${request.answers.map(a => `Frage: ${a.question}
Antwort: ${a.answer}
`).join('\n')}

Gesamtpunktzahl: ${request.score}%

Bitte gib eine detaillierte Analyse mit:
1. Stärken in der aktuellen digitalen Transformation
2. Konkrete Verbesserungsvorschläge für die schwächeren Bereiche
3. Nächste praktische Schritte zur Digitalisierung
4. Potenzielle Technologien oder Tools, die hilfreich sein könnten

Formatiere die Antwort übersichtlich mit Zwischenüberschriften.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du bist ein erfahrener Digitalisierungsberater für kleine und mittlere Unternehmen. Deine Aufgabe ist es, praktische und umsetzbare Empfehlungen zu geben."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      response: response.choices[0].message.content || 'Keine Analyse verfügbar.'
    };
  } catch (error) {
    console.error('Error analyzing digital fitness:', error);
    return {
      response: `Basierend auf Ihrer Gesamtpunktzahl von ${request.score}% hier eine generelle Einschätzung:

## Analyse
${request.score < 30 
  ? 'Sie stehen noch am Anfang Ihrer digitalen Transformation.'
  : request.score < 60 
  ? 'Sie sind auf einem guten Weg zur Digitalisierung.'
  : 'Sie sind bereits sehr gut digitalisiert!'}

## Handlungsempfehlungen
Wir empfehlen Ihnen, sich mit einem Digitalisierungsberater in Verbindung zu setzen, um einen detaillierten Aktionsplan zu erstellen.`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
