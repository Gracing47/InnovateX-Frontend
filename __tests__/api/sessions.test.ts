import { createMocks } from 'node-mocks-http'
import sessionsHandler from '../../pages/api/sessions'
import SessionRepository from '../../database/repositories/sessionRepository'

jest.mock('../../database/repositories/sessionRepository')

describe('/api/sessions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      const newSession = {
        userId: 'user123',
        currentCategory: 'digital-basics',
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: newSession,
      })

      const mockSession = {
        id: '1',
        ...newSession,
        startedAt: new Date(),
        lastActivity: new Date(),
        answers: [],
        completed: false,
      }

      ;(SessionRepository.createSession as jest.Mock).mockResolvedValueOnce(mockSession)

      await sessionsHandler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const responseData = JSON.parse(res._getData())
      expect({
        ...responseData,
        startedAt: new Date(responseData.startedAt),
        lastActivity: new Date(responseData.lastActivity)
      }).toEqual(mockSession)
    })

    it('should return 400 when session data is missing', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: null,
      })

      await sessionsHandler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Session data is required',
      })
    })
  })

  describe('GET /api/sessions', () => {
    it('should return sessions for a valid user ID', async () => {
      const userId = 'user123'
      const { req, res } = createMocks({
        method: 'GET',
        query: { userId },
      })

      const mockSessions = [
        {
          id: '1',
          userId,
          currentCategory: 'digital-basics',
          startedAt: new Date(),
          lastActivity: new Date(),
          answers: [],
          completed: false,
        },
      ]

      ;(SessionRepository.getUserSessions as jest.Mock).mockResolvedValueOnce(mockSessions)

      await sessionsHandler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const responseData = JSON.parse(res._getData())
      expect(responseData.map((session: any) => ({
        ...session,
        startedAt: new Date(session.startedAt),
        lastActivity: new Date(session.lastActivity)
      }))).toEqual(mockSessions)
    })

    it('should return 400 when user ID is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      })

      await sessionsHandler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User ID is required',
      })
    })
  })
})
