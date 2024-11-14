import { STEPS, CATEGORIES } from '../constants/digitalFitCheck';

export type Step = typeof STEPS[keyof typeof STEPS];
export type Category = typeof CATEGORIES[number];

export type AssessmentType = 'quick' | 'detailed';

export interface UserProfile {
  name: string;
  industry: string;
  numberOfEmployees: number;
  assessmentType: AssessmentType;
  role: string;
}

export interface Answer {
  category: Category;
  questionIndex: number;
  rating: number;
}

export interface Question {
  question: string;
  category: Category;
}

export interface SessionState {
  currentCategory: number;
  currentQuestion: number;
  answers: Answer[];
  totalScore: number;
  isComplete: boolean;
  userProfile?: UserProfile;
  questions?: Question[];
}

export interface Message {
  type: 'bot' | 'user';
  content: string;
}

export interface AssessmentResult {
  overallScore: number;
  categoryScores: {
    category: Category;
    score: number;
    maxScore: number;
    recommendations: string[];
  }[];
  summary: string;
  recommendations: string[];
}
