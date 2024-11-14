import { createMocks } from 'node-mocks-http'
import questionsHandler from '../../pages/api/questions'
import QuestionRepository from '../../database/repositories/questionRepository'

jest.mock('../../database/repositories/questionRepository')

describe('/api/questions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/questions', () => {
    it('should return questions for a valid category', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          category: 'digital-basics',
        },
      })

      const mockQuestions = [
        {
          id: '1',
          category: 'digital-basics',
          questionText: 'Test Question 1',
          answerOptions: [
            { text: 'Option 1', value: 1 },
            { text: 'Option 2', value: 2 },
          ],
        },
      ]

      ;(QuestionRepository.getQuestionsByCategory as jest.Mock).mockResolvedValueOnce(
        mockQuestions
      )

      await questionsHandler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockQuestions)
    })

    it('should return 400 when category is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      })

      await questionsHandler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Category parameter is required',
      })
    })
  })

  describe('POST /api/questions', () => {
    it('should create a new question', async () => {
      const newQuestion = {
        category: 'digital-basics',
        questionText: 'New Question',
        answerOptions: [
          { text: 'Option 1', value: 1 },
          { text: 'Option 2', value: 2 },
        ],
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: newQuestion,
      })

      ;(QuestionRepository.createQuestion as jest.Mock).mockResolvedValueOnce({
        id: '1',
        ...newQuestion,
      })

      await questionsHandler(req, res)

      expect(res._getStatusCode()).toBe(201)
      expect(JSON.parse(res._getData())).toEqual({
        id: '1',
        ...newQuestion,
      })
    })

    it('should return 400 when question data is missing', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: null,
      })

      await questionsHandler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Question data is required',
      })
    })
  })
})
