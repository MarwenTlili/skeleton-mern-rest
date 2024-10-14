import request from 'supertest'
import app from '../../src/app'
import User from '../../src/models/user.model'
import bcrypt from 'bcryptjs'
import { generateRefreshToken } from '../../src/utils/jwt.util'

describe('AuthService - Integration Tests', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should login a user and return tokens', async () => {
      const hashedPassword = await bcrypt.hash('hashedPassword', 10)

      const mockUser = new User({
        name: 'user',
        email: 'user@example.com',
        password: hashedPassword
      })
      await mockUser.save()

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'user@example.com', password: 'hashedPassword' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('refreshToken')
    })
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'user', email: 'user@example.com', password: 'password123' })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('refreshToken')
    })
  })

  describe('POST /api/v1/auth/refresh-tokens', () => {
    it('should refresh tokens', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)

      const mockUser = new User({
        name: 'user',
        email: 'user@example.com',
        password: hashedPassword,
      })

      const savedUser = await mockUser.save()
      const validRefreshToken = generateRefreshToken({
        id: savedUser._id.toString(), name: "user", email: "user@example.com", roles: ['USER']
      })
      savedUser.refreshToken = validRefreshToken
      await savedUser.save()

      const response = await request(app)
        .post('/api/v1/auth/refresh-tokens')
        .send({ refreshToken: validRefreshToken })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('refreshToken')
    })
  })

})
