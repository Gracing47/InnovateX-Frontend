import { CATEGORIES } from '../constants/digitalFitCheck';

export type Category = 
  | "Digitale Strategie"
  | "Digitale Prozesse"
  | "Digitale Kundenbeziehung"
  | "Digitale Geschäftsmodelle"
  | "Digitale Kompetenzen";

export interface Question {
  question: string;
  category: Category;
}

export interface Answer {
  category: Category;
  questionIndex: number;
  rating: number;
  question: string;
}

export interface UserProfile {
  name: string;
  industry: string;
  numberOfEmployees: number;
  assessmentType: 'quick' | 'detailed';
  role: string;
}

export interface SessionState {
  isComplete: boolean;
  currentCategory: number;
  currentQuestion: number;
  answers: Answer[];
  totalScore: number;
  scores: number[];
  questions?: Question[];
  userProfile?: UserProfile;
}

export interface Message {
  type: 'bot' | 'user';
  content: string;
}
