import request from 'supertest'
import app from '../src/app'
import { generateAccessToken } from '../src/utils/jwt.util'
import userService from '../src/services/user.service'
import IUser from '../src/interfaces/user.interface'
import mongoose from 'mongoose'

describe('Users API', () => {
  let adminAccessToken: string
  let user: IUser | null;

  beforeEach(async () => {
    // Create the users in the test database
    const admin = await userService.create({
      name: 'admin',
      email: 'admin@example.com',
      password: 'hashedpassword123',
      roles: ['ADMIN']
    })
    user = await userService.create({
      name: 'user',
      email: 'user@example.com',
      password: 'hashedpassword123'
    })

    if (admin) {
      adminAccessToken = generateAccessToken(admin._id, admin.roles as string[])
    }
  })

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userToPost = { name: 'John Doe', email: 'johndoe@example.com', password: 'hashedpassword123', roles: ['USER'] }

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(userToPost)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('name', userToPost.name)
      expect(res.body).toHaveProperty('email', userToPost.email)
      expect(res.body).not.toHaveProperty('password') // Password should not be returned
    })

    it('should handle validation errors', async () => {
      const invalidData = {} // Missing required fields

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(invalidData)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('should return a user by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${user?._id.toString()}`)
        .set('Authorization', adminAccessToken)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', 'user')
      expect(res.body).toHaveProperty('email', 'user@example.com')
    })

    it('should return 404 if user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString()

      const res = await request(app)
        .get(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', adminAccessToken)

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('User not found')
    })
  })

  describe('GET /api/v1/users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/api/v1/users')
        .set('Authorization', adminAccessToken)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
    })
  })

  describe('PUT /api/v1/users/:id', () => {
    it('should update a user successfully', async () => {
      const res = await request(app)
        .put(`/api/v1/users/${user?._id.toString()}`)
        .set('Authorization', adminAccessToken)
        .send({ name: 'user Updated', email: 'user.updated@example.com' })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id', user?._id.toString())
      expect(res.body).toHaveProperty('name', 'user Updated')
      expect(res.body).toHaveProperty('email', 'user.updated@example.com')
    })

    it('should return 404 if user to update not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString()

      const res = await request(app)
        .put(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', adminAccessToken)
        .send({ name: 'user Updated', email: 'user.updated@example.com' })

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('User not found')
    })
  })

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete a user successfully', async () => {
      const res = await request(app)
        .delete(`/api/v1/users/${user?._id.toString()}`)
        .set('Authorization', adminAccessToken)

      expect(res.status).toBe(204)
    })

    it('should return 404 if user to delete not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString()

      const res = await request(app)
        .delete(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', adminAccessToken)

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('User not found')
    })
  })
})
