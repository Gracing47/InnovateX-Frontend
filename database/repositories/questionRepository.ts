import dbConnect from '../config';
import Question, { IQuestion } from '../models/Question';
import { Document, Types, Model, Query } from 'mongoose';

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

type QuestionDocument = Document<unknown, {}, IQuestion> & IQuestion;

export class QuestionRepository {
  private static async ensureConnection() {
    try {
      await dbConnect();
    } catch (error) {
      throw new DatabaseError('Failed to connect to database');
    }
  }

  private static validateId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  static async getQuestionsByCategory(category: string): Promise<IQuestion[]> {
    if (!category) {
      throw new Error('Category is required');
    }

    try {
      await this.ensureConnection();
      const questions = await (Question as Model<QuestionDocument>)
        .find({ category, isActive: true })
        .sort({ order: 1 })
        .lean();
      
      return questions as IQuestion[];
    } catch (error) {
      throw new DatabaseError(`Failed to fetch questions for category ${category}: ${error.message}`);
    }
  }

  static async getQuestionById(id: string): Promise<IQuestion | null> {
    if (!this.validateId(id)) {
      throw new Error('Invalid question ID format');
    }

    try {
      await this.ensureConnection();
      const question = await (Question as Model<QuestionDocument>)
        .findById(id)
        .lean();
      return question as IQuestion | null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch question with ID ${id}: ${error.message}`);
    }
  }

  static async createQuestion(questionData: Omit<IQuestion, 'createdAt' | 'updatedAt'>): Promise<IQuestion> {
    if (!questionData.category || !questionData.questionText || !questionData.answerOptions?.length) {
      throw new Error('Missing required question fields: category, questionText, and answerOptions are required');
    }

    try {
      await this.ensureConnection();
      
      // Get the highest order number for the category
      const highestOrder = await (Question as Model<QuestionDocument>)
        .findOne({ category: questionData.category })
        .sort({ order: -1 })
        .select('order')
        .lean();
      
      // Set the order to be one more than the highest, or 1 if no questions exist
      const order = highestOrder ? (highestOrder.order + 1) : 1;
      
      const newQuestion = new Question({
        ...questionData,
        order,
        isActive: questionData.isActive ?? true
      });
      
      const savedQuestion = await newQuestion.save();
      return savedQuestion.toObject();
    } catch (error) {
      throw new DatabaseError(`Failed to create question: ${error.message}`);
    }
  }

  static async updateQuestion(id: string, questionData: Partial<IQuestion>): Promise<IQuestion | null> {
    if (!this.validateId(id)) {
      throw new Error('Invalid question ID format');
    }

    try {
      await this.ensureConnection();
      const updatedQuestion = await (Question as Model<QuestionDocument>)
        .findByIdAndUpdate(
          id,
          { $set: questionData },
          { 
            new: true,
            runValidators: true
          }
        )
        .lean();

      if (!updatedQuestion) {
        throw new Error(`Question with ID ${id} not found`);
      }

      return updatedQuestion as IQuestion;
    } catch (error) {
      throw new DatabaseError(`Failed to update question with ID ${id}: ${error.message}`);
    }
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    if (!this.validateId(id)) {
      throw new Error('Invalid question ID format');
    }

    try {
      await this.ensureConnection();
      const result = await (Question as Model<QuestionDocument>)
        .findByIdAndDelete(id)
        .lean();
      return result !== null;
    } catch (error) {
      throw new DatabaseError(`Failed to delete question with ID ${id}: ${error.message}`);
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      await this.ensureConnection();
      return await (Question as Model<QuestionDocument>).distinct('category');
    } catch (error) {
      throw new DatabaseError(`Failed to fetch categories: ${error.message}`);
    }
  }

  static async getNextQuestion(category: string, currentOrder: number): Promise<IQuestion | null> {
    if (!category) {
      throw new Error('Category is required');
    }

    if (typeof currentOrder !== 'number') {
      throw new Error('Current order must be a number');
    }

    try {
      await this.ensureConnection();
      const question = await (Question as Model<QuestionDocument>)
        .findOne({
          category,
          isActive: true,
          order: { $gt: currentOrder }
        })
        .sort({ order: 1 })
        .lean();

      return question as IQuestion | null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch next question: ${error.message}`);
    }
  }

  static async bulkCreateQuestions(questions: Array<Omit<IQuestion, 'createdAt' | 'updatedAt'>>): Promise<IQuestion[]> {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Questions array is required and must not be empty');
    }

    // Validate all questions have required fields
    questions.forEach((question, index) => {
      if (!question.category || !question.questionText || !question.answerOptions?.length) {
        throw new Error(`Question at index ${index} is missing required fields`);
      }
    });

    try {
      await this.ensureConnection();
      
      // Get the highest order number for each category
      const categories = [...new Set(questions.map(q => q.category))];
      const orderMap = new Map<string, number>();
      
      for (const category of categories) {
        const highestOrder = await (Question as Model<QuestionDocument>)
          .findOne({ category })
          .sort({ order: -1 })
          .select('order')
          .lean();
        orderMap.set(category, highestOrder ? highestOrder.order : 0);
      }

      // Assign order numbers to new questions
      const questionsToCreate = questions.map(question => {
        const currentOrder = orderMap.get(question.category) || 0;
        orderMap.set(question.category, currentOrder + 1);
        return {
          ...question,
          order: currentOrder + 1,
          isActive: question.isActive ?? true
        };
      });

      // Create all questions using insertMany
      const createdQuestions = await (Question as Model<QuestionDocument>).insertMany(
        questionsToCreate,
        { lean: true }
      );
      
      return createdQuestions as unknown as IQuestion[];
    } catch (error) {
      throw new DatabaseError(`Failed to bulk create questions: ${error.message}`);
    }
  }
}

export default QuestionRepository;
