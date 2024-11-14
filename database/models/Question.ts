import mongoose from 'mongoose';

// Interface für die Antwortoptionen
interface IAnswerOption {
  text: string;
  value: number;
  feedback?: string;
}

// Interface für das Fragen-Dokument
export interface IQuestion {
  category: string;
  subcategory?: string;
  questionText: string;
  answerOptions: IAnswerOption[];
  order: number;
  isActive: boolean;
  weight?: number;
  helpText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: Number, required: true },
  feedback: { type: String }
});

const QuestionSchema = new mongoose.Schema<IQuestion>({
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  subcategory: { 
    type: String,
    index: true 
  },
  questionText: { 
    type: String, 
    required: true 
  },
  answerOptions: [AnswerOptionSchema],
  order: { 
    type: Number, 
    required: true,
    index: true 
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  weight: { 
    type: Number,
    default: 1 
  },
  helpText: String
}, {
  timestamps: true
});

// Index für effiziente Abfragen
QuestionSchema.index({ category: 1, order: 1 });

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
