const request = require('supertest');
const bcrypt = require('bcryptjs');
const sequelize = require('../../src/config/database');
const User = require('../../src/models/userModel');
const app = require('../../src/app');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before all tests
    // Create a user for general testing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('securepassword', salt);
    await User.create({
        name: 'Alice',
        email: 'alice@example.com',
        password: hashedPassword
    });
});

afterAll(async () => {
    await sequelize.close(); // Close connection after all tests
});

describe('User API Endpoints', () => {
    let userId;

    test('POST /users should create a new user', async () => {
        const newUser = {
            name: 'Bob',
            email: 'bob@example.com',
            password: 'password123'
        };
        const response = await request(app)
            .post('/users')
            .send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('bob@example.com');
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
        expect(response.body.email).toBe('bob@example.com');
    });

    test('PUT /users/:id should update user information', async () => {
        const updatedInfo = {
            name: 'Bob Smith',
            email: 'bob.smith@example.com'
        };
        const response = await request(app)
            .put(`/users/${userId}`)
            .send(updatedInfo);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Bob Smith');
    });

    test('DELETE /users/:id should delete a user', async () => {
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.statusCode).toBe(204);
    });

    test('GET /users/:id after delete should return 404', async () => {
        const response = await request(app).get(`/users/${userId}`);
        expect(response.statusCode).toBe(404);
    });

    // Tests for login functionality
    describe('POST /users/login', () => {
        test('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'alice@example.com',
                    password: 'securepassword'
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');  // Ensure a token is received
            expect(response.body.user.email).toBe('alice@example.com');
        });

        test('should fail to login with incorrect credentials', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'alice@example.com',
                    password: 'wrongpassword'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('Password incorrect'); // Updated to match actual output
        });

        test('should fail to login with missing credentials', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'alice@example.com'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('Missing credentials'); // Updated to match actual output
        });
    });
});
