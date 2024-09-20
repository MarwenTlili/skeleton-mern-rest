import request from 'supertest'

import app from '../src/app'
import userService from '../src/services/user.service'
import { generateAccessToken } from '../src/utils/jwt.util'
import { mockAdminUser, mockUser, mockUsers } from './mocks/user.mocks'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '../src/config/env'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../src/types'
import CustomError from '../src/utils/CustomError'
import IUser from '../src/interfaces/user.interface'

// Mock userService to avoid real database interactions
jest.mock('../src/services/user.service')

// Mock authorizedRoles to isolate controller logic testing
jest.mock('../src/middlewares/authorizedRoles.middleware', () => ({
  authorizedRoles: jest.fn((...roles) => (req: CustomRequest, res: Response, next: NextFunction) => {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '')
    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied, No token provided!'
      })
    }
    const decoded = jwt.verify(accessToken, JWT_SECRET)
    if (roles.includes((decoded as JwtPayload).roles[0])) {
      req.user = decoded
      return next()
    }
    return res.status(403).json({ message: 'Access denied' })
  }),
}))

describe('UserController', () => {
  let adminAccessToken: string

  beforeAll(async () => {
    adminAccessToken = generateAccessToken(mockAdminUser.id, mockAdminUser.roles as string[])
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/v1/users', () => {
    it('should return 200 and a list of users when the token is valid', async () => {
      (userService.getAll as jest.Mock).mockResolvedValue(mockUsers)

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)

      expect(response.status).toBe(200)
      // expect(response.body).toEqual(mockUsers)
      expect(response.body.length).toBe(4)
      expect(userService.getAll).toHaveBeenCalledTimes(1)
    })

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(401)

      expect(response.body.message).toBe('Access denied, No token provided!')
    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('should return 200 and the user if found', async () => {
      (userService.getById as jest.Mock).mockResolvedValue(mockUser)

      const response = await request(app)
        .get(`/api/v1/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.email).toEqual(mockUser.email)
      expect(userService.getById).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if user not found', async () => {
      (userService.getById as jest.Mock).mockResolvedValue(null)

      const response = await request(app)
        .get(`/api/v1/users/nonexistentId`)
        .set('Authorization', generateAccessToken('wrong_id', ['ADMIN']))

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('User not found')
    })
  })

  describe('POST /api/v1/users', () => {
    it('should create a new user and return 201', async () => {
      const newUser: Partial<IUser> = {
        name: 'user',
        email: 'user@example.com',
        password: 'hashedpassword123',
        roles: ['USER'],
        isActive: false
      };
      (userService.create as jest.Mock).mockResolvedValue(newUser)

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body.email).toEqual(newUser.email)
      expect(userService.create).toHaveBeenCalledTimes(1)
    })

    it('should return 400 for invalid data', async () => {
      const invalidUser = { email: 'invalid-email@example.com' } // Missing required fields

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(invalidUser)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })

    it('should return 409 for already exist user', async () => {
      const userData: Partial<IUser> = {
        name: 'user',
        email: 'user@example.com',
        password: 'hashedhashedpassword123',
        roles: ['USER'],
        isActive: false
      };

      // Mock the service to throw a conflict error
      (userService.create as jest.Mock).mockRejectedValue(new CustomError('Name already exists', 409))

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(userData)

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('PUT /api/v1/users/:id', () => {
    it('should update an existing user and return 200', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      (userService.update as jest.Mock).mockResolvedValue(updatedUser)

      const response = await request(app)
        .put(`/api/v1/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: 'Updated Name' })
        .expect(200)

      expect(response.body.email).toEqual(updatedUser.email)
      expect(userService.update).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if user not found', async () => {
      (userService.update as jest.Mock).mockResolvedValue(null)

      const response = await request(app)
        .put(`/api/v1/users/nonexistentId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: 'Updated Name' })
        .expect(404)

      expect(response.body.message).toBe('User not found')
    })
  })

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete a user and return 204', async () => {
      (userService.delete as jest.Mock).mockResolvedValue(mockUser)

      const response = await request(app)
        .delete(`/api/v1/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204)

      expect(userService.delete).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if user not found', async () => {
      (userService.delete as jest.Mock).mockResolvedValue(null)

      const response = await request(app)
        .delete(`/api/v1/users/nonexistentId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404)

      expect(response.body.message).toBe('User not found')
    })
  })
})
