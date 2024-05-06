const request = require('supertest');
const sequelize = require('../../src/config/database'); // updated path
const User = require('../../src/models/userModel'); // specific model import
const app = require('../../src/app');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before all tests
});

afterAll(async () => {
  await sequelize.close(); // Close connection after all tests
});

describe('User API Endpoints', () => {
  let userId;

  test('POST /users should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'securepassword'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe('alice@example.com');
    userId = response.body.id;  // Store user ID for use in later tests
  });

  test('GET /users should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /users/:id should return a user', async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('alice@example.com');
  });

  test('PUT /users/:id should update user information', async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .send({
        name: 'Alice Smith',
        email: 'alice.smith@example.com'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Alice Smith');
  });

  test('DELETE /users/:id should delete a user', async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(204);
  });

  test('GET /users/:id after delete should return 404', async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(404);
  });
});
