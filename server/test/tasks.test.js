const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
let token = '';

beforeAll(async () => {
  // Register and login a user to get token
  const registerRes = await request(app).post('/api/auth/register').send({
    name: 'Task Tester',
    email: `task${Date.now()}@mail.com`,
    password: '123456'
  });

  token = registerRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task API', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test',
        dueDate: new Date(),
        assignedTo: 'mock-user-id'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });

  it('should fail to create a task with missing fields', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Incomplete Task' });

    expect(res.statusCode).toBe(400);
  });
});
