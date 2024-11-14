import { NextApiRequest, NextApiResponse } from 'next';
import QuestionRepository from '../../../database/repositories/questionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid question ID' });
  }

  try {
    switch (method) {
      case 'GET':
        // Hole eine spezifische Frage
        const question = await QuestionRepository.getQuestionById(id);
        if (!question) {
          return res.status(404).json({ error: 'Question not found' });
        }
        return res.status(200).json(question);

      case 'PUT':
        // Aktualisiere eine Frage
        if (!req.body) {
          return res.status(400).json({ error: 'Question data is required' });
        }
        const updatedQuestion = await QuestionRepository.updateQuestion(id, req.body);
        if (!updatedQuestion) {
          return res.status(404).json({ error: 'Question not found' });
        }
        return res.status(200).json(updatedQuestion);

      case 'DELETE':
        // Lösche eine Frage
        const deleted = await QuestionRepository.deleteQuestion(id);
        if (!deleted) {
          return res.status(404).json({ error: 'Question not found' });
        }
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
