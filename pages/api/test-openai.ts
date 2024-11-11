import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

type ResponseData = {
  message: string
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed', success: false })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Sage 'OpenAI ist erfolgreich verbunden!'" }],
    })

    return res.status(200).json({ 
      message: completion.choices[0].message.content || 'Verbindung erfolgreich',
      success: true 
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return res.status(500).json({ 
      message: 'Fehler bei der Verbindung zu OpenAI',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    })
  }
} 