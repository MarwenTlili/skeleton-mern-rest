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

  describe('getById', () => {
    it('should return a user when found', async () => {
      (userService.getById as jest.Mock).mockResolvedValueOnce({ id: '1', name: 'user' });

      const response = await request(app).get('/api/v1/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', name: 'user' });
      expect(userService.getById).toHaveBeenCalledWith('1');
    })

    it('should return 404 when user is not found', async () => {
      (userService.getById as jest.Mock).mockResolvedValueOnce(null);
      const response = await request(app).get('/api/v1/users/1');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    })

    it('should return 500 when there is an error', async () => {
      (userService.getById as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      const response = await request(app).get('/api/v1/users/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error');
    })
  })

  describe('getAll', () => {
    it('should return a list of users', async () => {
      (userService.getAll as jest.Mock).mockResolvedValueOnce([{ id: '1', name: 'user' }]);

      const response = await request(app).get('/api/v1/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: '1', name: 'user' }]);
      expect(userService.getAll).toHaveBeenCalled();
    })

    it('should return 500 when there is an error', async () => {
      (userService.getAll as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      const response = await request(app).get('/api/v1/users');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error');
    })
  })

  describe('update', () => {
    it('should update a user successfully', async () => {
      (userService.update as jest.Mock).mockResolvedValueOnce({ id: '1', name: 'user - updated' });

      const response = await request(app)
        .put('/api/v1/users/1')
        .send({ name: 'user - updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', name: 'user - updated' });
      expect(userService.update).toHaveBeenCalledWith('1', { name: 'user - updated' });
    })

    it('should return 404 when user is not found', async () => {
      (userService.update as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app)
        .put('/api/v1/users/1')
        .send({ name: 'user - updated' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    })

    it('should return 500 when there is an error', async () => {
      (userService.update as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      const response = await request(app)
        .put('/api/v1/users/1')
        .send({ name: 'user - updated' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error');
    })
  })

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      (userService.delete as jest.Mock).mockResolvedValueOnce({ id: '1' });

      const response = await request(app).delete('/api/v1/users/1');

      expect(response.status).toBe(204);
      expect(userService.delete).toHaveBeenCalledWith('1');
    })

    it('should return 404 when user is not found', async () => {
      (userService.delete as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app).delete('/api/v1/users/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    })

    it('should return 500 when there is an error', async () => {
      (userService.delete as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      const response = await request(app).delete('/api/v1/users/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error');
    })
  })
})
