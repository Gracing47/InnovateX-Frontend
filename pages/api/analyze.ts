import { NextApiRequest, NextApiResponse } from 'next';
import { openai } from '@/lib/openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: 'OpenAI API Key nicht konfiguriert',
      details: 'Bitte stellen Sie sicher, dass die OPENAI_API_KEY Umgebungsvariable gesetzt ist.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Nur POST-Anfragen sind erlaubt' });
  }

  try {
    const { industry, answers, score } = req.body;

    if (!industry || !answers || score === undefined) {
      return res.status(400).json({ 
        error: 'Fehlende Parameter',
        details: 'Industry, answers und score sind erforderlich.'
      });
    }

    const prompt = `
Als Digitalisierungsexperte analysiere die folgenden Antworten für ein Unternehmen aus der Branche ${industry}:

${answers.map((a: any) => `Frage: ${a.question}
Antwort: ${a.answer}
Punkte: ${a.points}/5`).join('\n\n')}

Gesamtscore: ${score}%

Bitte gib eine kurze, konstruktive Analyse mit konkreten Verbesserungsvorschlägen. 
Fokussiere auf die wichtigsten Handlungsfelder und gib 2-3 praktische nächste Schritte.
Halte die Antwort freundlich und ermutigend.
Formatiere die Antwort in Markdown mit folgender Struktur:

## Analyse
[Ihre Analyse hier]

## Handlungsempfehlungen
1. [Erste Empfehlung]
2. [Zweite Empfehlung]
3. [Dritte Empfehlung]

## Nächste Schritte
[Konkrete nächste Schritte]
`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Du bist ein erfahrener Digitalisierungsberater, der Unternehmen hilft, ihre digitale Transformation zu gestalten. Deine Antworten sind präzise, praktisch und ermutigend. Benutze eine professionelle aber freundliche Sprache."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Keine Analyse verfügbar';

    res.status(200).json({ response });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Analyse',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
}
