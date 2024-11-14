import { NextApiRequest, NextApiResponse } from 'next';
import SessionRepository from '../../../database/repositories/sessionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  try {
    switch (method) {
      case 'GET':
        // Hole eine spezifische Session
        const session = await SessionRepository.getSession(id);
        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
        return res.status(200).json(session);

      case 'PUT':
        // Aktualisiere eine Session
        if (!req.body) {
          return res.status(400).json({ error: 'Session data is required' });
        }
        const updatedSession = await SessionRepository.updateSession(id, req.body);
        if (!updatedSession) {
          return res.status(404).json({ error: 'Session not found' });
        }
        return res.status(200).json(updatedSession);

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
