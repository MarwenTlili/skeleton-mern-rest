import request from 'supertest'

import app from '../src/app'
import userService from '../src/services/user.service'
import CustomError from '../src/utils/CustomError'

// Mock the UserService
jest.mock('../src/services/user.service')

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new user and return 201 status', async () => {
      const mockData = { name: 'user', email: 'user@example.com', password: 'securepassword' };

      (userService.create as jest.Mock).mockResolvedValue(mockData)

      const res = await request(app).post('/api/v1/users').send(mockData)

      if (res.error) console.log(res.error)

      expect(res.status).toBe(201)
      expect(res.body).toEqual(mockData)
      expect(userService.create).toHaveBeenCalledWith(mockData)
    })

    it('should return 400 if validation fails', async () => {
      const mockData = {}
      const res = await request(app).post('/api/v1/users').send(mockData)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
    })

    it('should return 409 if user name already exists', async () => {
      const mockData = { name: 'user', email: 'user@example.com', password: 'securepassword' };
      (userService.create as jest.Mock).mockRejectedValue(new CustomError('Name already exists', 409))

      const res = await request(app).post('/api/v1/users').send(mockData)

      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty('message', 'Name already exists')
    })
  })
})
