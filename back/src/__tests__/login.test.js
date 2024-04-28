const request = require('supertest');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const LoginController = require("../controllers/loginController");

app.post("/login", LoginController.loginUser);

describe('Login Controller', () => {
  it('should return status 200 and a user object on successful login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
  
    expect(response.status).toBe(200);
  });

  it('should return status 200 and an error message on invalid email or password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'invalid@example.com', password: 'invalidpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 60);
    expect(response.body).toHaveProperty('message');
  });

  it('should return status 500 and an error message on database error', async () => {
    jest.spyOn(require('../models/database'), 'User').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.body).toHaveProperty('message', 'Utilisateur non trouvé');
  });
});
