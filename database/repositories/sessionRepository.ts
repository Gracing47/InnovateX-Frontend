import dbConnect from '../config';
import Session, { ISession } from '../models/Session';

export class SessionRepository {
  static async initialize() {
    await dbConnect();
  }

  static async createSession(sessionData: Partial<ISession>): Promise<ISession> {
    await this.initialize();
    return Session.create(sessionData);
  }

  static async getSession(sessionId: string): Promise<ISession | null> {
    await this.initialize();
    return Session.findById(sessionId);
  }

  static async updateSession(sessionId: string, sessionData: Partial<ISession>): Promise<ISession | null> {
    await this.initialize();
    return Session.findByIdAndUpdate(
      sessionId,
      {
        ...sessionData,
        lastActivity: new Date()
      },
      { new: true }
    );
  }

  static async addAnswer(
    sessionId: string,
    questionId: string,
    selectedAnswer: number
  ): Promise<ISession | null> {
    await this.initialize();
    return Session.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          answers: {
            questionId,
            selectedAnswer,
            timestamp: new Date()
          }
        },
        lastActivity: new Date()
      },
      { new: true }
    );
  }

  static async completeSession(
    sessionId: string,
    totalScore: number,
    analysis: string
  ): Promise<ISession | null> {
    await this.initialize();
    return Session.findByIdAndUpdate(
      sessionId,
      {
        completed: true,
        totalScore,
        analysis,
        lastActivity: new Date()
      },
      { new: true }
    );
  }

  static async getUserSessions(userId: string): Promise<ISession[]> {
    await this.initialize();
    return Session.find({ userId }).sort({ startedAt: -1 });
  }

  static async getIncompleteSessions(): Promise<ISession[]> {
    await this.initialize();
    const thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);

    return Session.find({
      completed: false,
      lastActivity: { $lt: thresholdTime }
    });
  }
}

export default SessionRepository;
