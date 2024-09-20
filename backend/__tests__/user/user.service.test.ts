import mongoose from 'mongoose'

import User from '../../src/models/user.model'
import UserService from '../../src/services/user.service'
import CustomError from '../../src/utils/CustomError'

describe('UserService', () => {
  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = { name: 'user1', email: 'user1@example.com', password: 'password123' }
      const user = await UserService.create(userData)

      expect(user).toHaveProperty('_id')
      expect(user?.name).toBe('user1')
      expect(user?.email).toBe('user1@example.com')
    })

    it('should throw error if name already exists', async () => {
      const user1 = { name: 'user1', email: 'user1@example.com', password: 'password123' }
      const user2 = { name: 'user1', email: 'userx@example.com', password: 'password123' }

      await UserService.create(user1)

      await expect(UserService.create(user2)).rejects.toThrow(
        new CustomError('Name already exists', 409)
      )
    })

    it('should throw error if email already exists', async () => {
      const user1 = { name: 'user1', email: 'user1@example.com', password: 'password123' }
      const user2 = { name: 'userx', email: 'user1@example.com', password: 'password123' }

      await UserService.create(user1)

      await expect(UserService.create(user2)).rejects.toThrow(
        new CustomError('Email already exists', 409)
      )
    })
  })

  describe('getbyId', () => {
    it('should return a user by id', async () => {
      const user = new User({
        name: 'user',
        email: 'user@example.com',
        password: 'password123'
      })
      await user.save()

      const foundUser = await UserService.getById(user._id.toString())

      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe('user')
      expect(foundUser?.email).toBe('user@example.com')
    })

    it('should return null if user does not exist', async () => {
      const foundUser = await UserService.getById(new mongoose.Types.ObjectId().toString())
      expect(foundUser).toBeNull()
    })
  })

  describe('findByIdentifier', () => {
    it('should return user by name', async () => {
      const user = new User({
        name: 'user',
        email: 'user@example.com',
        password: 'password123'
      })
      await user.save()

      const foundUser = await UserService.findByIdentifier('user')

      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe('user')
      expect(foundUser?.email).toBe('user@example.com')
    })
    it('should return user by email', async () => {
      const user = new User({
        name: 'user',
        email: 'user@example.com',
        password: 'password123'
      })
      await user.save()

      const foundUser = await UserService.findByIdentifier('user@example.com')

      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe('user')
      expect(foundUser?.email).toBe('user@example.com')
    })
    it('sould return null if user does not exist', async () => {
      const foundUser = await UserService.findByIdentifier('nonexistent')

      expect(foundUser).toBeNull()
    })
  })

  describe('getAll', () => {
    it('should return all users', async () => {
      const user1 = new User({
        name: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      })
      const user2 = new User({
        name: 'user2',
        email: 'user2@example.com',
        password: 'password123',
      })
      await user1.save()
      await user2.save()

      const users = await UserService.getAll()

      expect(users.length).toBe(2)
      expect(users[0].name).toBe('user1')
      expect(users[1].name).toBe('user2')
    })
  })

  describe('update', () => {
    it('should update a user by id', async () => {
      const user = new User({
        name: 'user',
        email: 'user@example.com',
        password: 'password123',
      })
      await user.save()

      const updatedUser = await UserService.update(user._id.toString(), {
        name: 'user Updated',
      })

      expect(updatedUser).not.toBeNull()
      expect(updatedUser?.name).toBe('user Updated')
    })

    it('should return null if user does not exist', async () => {
      const updatedUser = await UserService.update(new mongoose.Types.ObjectId().toString(), {
        name: 'nonexistent',
      })

      expect(updatedUser).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const user = new User({
        name: 'user',
        email: 'user@example.com',
        password: 'password123',
      })
      await user.save()

      const deletedUser = await UserService.delete(user._id.toString())

      expect(deletedUser).not.toBeNull()
      expect(deletedUser?.name).toBe('user')

      const foundUser = await UserService.getById(user._id.toString())
      expect(foundUser).toBeNull()
    })

    it('should return null if user does not exist', async () => {
      const deletedUser = await UserService.delete(new mongoose.Types.ObjectId().toString())
      expect(deletedUser).toBeNull()
    })
  })
})
