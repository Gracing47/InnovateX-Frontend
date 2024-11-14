import mongoose from 'mongoose';

// Interface für die Benutzerantwort
interface IUserAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer: number;
  timestamp: Date;
}

// Interface für die Session
export interface ISession {
  userId?: string;
  startedAt: Date;
  lastActivity: Date;
  currentCategory: string;
  currentQuestionIndex: number;
  answers: IUserAnswer[];
  completed: boolean;
  totalScore?: number;
  analysis?: string;
  metadata?: Record<string, any>;
}

const UserAnswerSchema = new mongoose.Schema({
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question',
    required: true 
  },
  selectedAnswer: { 
    type: Number, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const SessionSchema = new mongoose.Schema<ISession>({
  userId: { 
    type: String,
    index: true 
  },
  startedAt: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  lastActivity: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  currentCategory: { 
    type: String, 
    required: true 
  },
  currentQuestionIndex: { 
    type: Number, 
    default: 0 
  },
  answers: [UserAnswerSchema],
  completed: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  totalScore: Number,
  analysis: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Indexes für häufige Abfragen
SessionSchema.index({ userId: 1, completed: 1 });
SessionSchema.index({ startedAt: -1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
