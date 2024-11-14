import { NextApiRequest, NextApiResponse } from 'next';
import QuestionRepository from '../../../database/repositories/questionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Hole alle Fragen einer Kategorie
        const { category } = req.query;
        if (typeof category !== 'string') {
          return res.status(400).json({ error: 'Category parameter is required' });
        }
        const questions = await QuestionRepository.getQuestionsByCategory(category);
        return res.status(200).json(questions);

      case 'POST':
        // Erstelle eine neue Frage
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Question data is required' });
        }
        const newQuestion = await QuestionRepository.createQuestion(req.body);
        return res.status(201).json(newQuestion);

      case 'PUT':
        // Bulk Update für Fragen
        if (!Array.isArray(req.body)) {
          return res.status(400).json({ error: 'Array of questions is required' });
        }
        const updatedQuestions = await QuestionRepository.bulkCreateQuestions(req.body);
        return res.status(200).json(updatedQuestions);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
