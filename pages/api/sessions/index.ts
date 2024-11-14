import { NextApiRequest, NextApiResponse } from 'next';
import SessionRepository from '../../../database/repositories/sessionRepository';

// Helper function to convert string dates back to Date objects
function convertDates(obj: any) {
  const converted = { ...obj };
  if (converted.startedAt) {
    converted.startedAt = new Date(converted.startedAt);
  }
  if (converted.lastActivity) {
    converted.lastActivity = new Date(converted.lastActivity);
  }
  return converted;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        // Erstelle eine neue Session mit zusätzlichen Benutzerinformationen
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Session data is required' });
        }

        const { name, industry, numberOfEmployees, ...sessionData } = req.body;

        if (!name || !industry || !numberOfEmployees) {
          return res.status(400).json({ error: 'Name, industry, and number of employees are required' });
        }

        const newSession = await SessionRepository.createSession({
          ...sessionData,
          user: {
            name,
            industry,
            numberOfEmployees,
          },
        });
        // Convert dates before sending response
        const sessionResponse = convertDates(JSON.parse(JSON.stringify(newSession)));
        return res.status(201).json(sessionResponse);

      case 'GET':
        // Hole Sessions eines Benutzers
        const { userId } = req.query;
        if (typeof userId !== 'string') {
          return res.status(400).json({ error: 'User ID is required' });
        }
        const sessions = await SessionRepository.getUserSessions(userId);
        // Convert dates in all sessions before sending response
        const sessionsResponse = sessions.map(session => 
          convertDates(JSON.parse(JSON.stringify(session)))
        );
        return res.status(200).json(sessionsResponse);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
