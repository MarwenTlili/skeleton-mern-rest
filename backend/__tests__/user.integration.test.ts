import request from 'supertest'
import app from '../src/app'
import mongoose from 'mongoose'

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

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'user', email: 'user@example.com', password: '123456' });

      const userId = response.body._id;

      const res = await request(app).get(`/api/v1/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('name', 'user');
      expect(res.body).toHaveProperty('email', 'user@example.com');
    });

    it('should return 404 if user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).get(`/api/v1/users/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    })
  })

  describe('GET /users', () => {
    it('should return all users', async () => {
      await request(app).post('/api/v1/users').send({ name: 'User One', email: 'one@example.com', password: '123456' });
      await request(app).post('/api/v1/users').send({ name: 'User Two', email: 'two@example.com', password: '123456' });

      const res = await request(app).get('/api/v1/users');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    })
  })

  describe('PUT /users/:id', () => {
    it('should update a user successfully', async () => {
      const userRes = await request(app)
        .post('/api/v1/users')
        .send({ name: 'user Doe', email: 'user@example.com', password: '123456' });

      const userId = userRes.body._id;

      const res = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send({ name: 'user Updated', email: 'user.updated@example.com' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('name', 'user Updated');
      expect(res.body).toHaveProperty('email', 'user.updated@example.com');
    })

    it('should return 404 if user to update not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .put(`/api/v1/users/${nonExistentId}`)
        .send({ name: 'user Updated', email: 'user.updated@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete a user successfully', async () => {
      const userRes = await request(app)
        .post('/api/v1/users')
        .send({ name: 'user Doe', email: 'user@example.com', password: '123456' });

      const userId = userRes.body._id;

      const res = await request(app).delete(`/api/v1/users/${userId}`);

      expect(res.status).toBe(204);
    })

    it('should return 404 if user to delete not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).delete(`/api/v1/users/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    })
  })
})
