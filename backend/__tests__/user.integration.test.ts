import request from 'supertest'
import app from '../src/app'

describe('User API', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { name: 'user', email: 'user@example.com', password: 'securepassword' }

      const res = await request(app).post('/api/v1/users').send(userData)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('name', userData.name)
      expect(res.body).toHaveProperty('email', userData.email)
      expect(res.body).not.toHaveProperty('password') // Password should not be returned
    })

    it('should handle validation errors', async () => {
      const invalidData = {} // Missing required fields

      const res = await request(app).post('/api/v1/users').send(invalidData)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
    })
  })
})
