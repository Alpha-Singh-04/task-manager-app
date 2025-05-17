const request = require('supertest');
const app = require('../index'); // Your Express app
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to DB if needed
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: `test${Date.now()}@mail.com`,
      password: '123456'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to login with wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@mail.com',
      password: 'wrongpass'
    });

    expect(res.statusCode).toBe(401);
  });
});
