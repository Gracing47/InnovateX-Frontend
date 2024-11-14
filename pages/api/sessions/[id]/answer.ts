import { NextApiRequest, NextApiResponse } from 'next';
import SessionRepository from '../../../../database/repositories/sessionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  try {
    if (method === 'POST') {
      const { questionId, selectedAnswer } = req.body;

      if (!questionId || typeof selectedAnswer !== 'number') {
        return res.status(400).json({ 
          error: 'Question ID and selected answer are required' 
        });
      }

      const updatedSession = await SessionRepository.addAnswer(
        id,
        questionId,
        selectedAnswer
      );

      if (!updatedSession) {
        return res.status(404).json({ error: 'Session not found' });
      }

      return res.status(200).json(updatedSession);
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
