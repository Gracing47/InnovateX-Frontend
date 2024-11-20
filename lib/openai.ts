import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.error('Warning: OPENAI_API_KEY ist nicht in den Umgebungsvariablen definiert');
}

export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key-for-development',
  timeout: 30000, // 30 Sekunden Timeout
  maxRetries: 3,
});

export interface AIResponse {
  response: string;
  error?: string;
}
