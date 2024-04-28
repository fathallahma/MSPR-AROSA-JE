const request = require('supertest');
const { User, sequelize } = require('../models/database');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const express = require('express');
const bodyParser = require('body-parser');
const UserController = require('../controllers/userController');

const app = express();

app.use(bodyParser.json());

app.get('/users', UserController.getAllUsers);
app.post('/create-user', UserController.createUser);
app.put('/updateUser', UserController.updateUser);
app.delete('/deleteUser', UserController.deleteUser);
app.delete('/deleteUserByAdmin', UserController.deleteUserByAdmin);

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Controller', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@test.com',
      password: 'password1234+',
      role: 'ROLE_USER',
    });
  });

  afterEach(async () => {
    await User.destroy({ where: { id: testUser.id } });
  });

  it('should get all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should create a new user', async () => {
     const lastName = 'Smith';
     const firstName = 'Alice';
     const email = 'alice.smith@test.com';
     const password = 'password1234+';
  
     const response = await request(app)
       .post('/create-user')
       .send({
         lastName: lastName,
         firstName: firstName,
         email: email,
         password: password,
       });
  
     // Vérification la création de l'utilisateur
     expect(response.body.user).toHaveProperty('lastName', lastName);
     expect(response.body.user).toHaveProperty('firstName', firstName);
  
     expect(response.status).toBe(201);
     expect(response.body).toHaveProperty('status', 10);
   });
  
  
  it('should update user password', async () => {
    const token = jwt.sign({ userId: testUser.id }, 'arosaje');
    const response = await request(app)
      .put('/updateUser')
      .send({
        token: token,
        password: 'newpassword123',
      });

    expect(response.status).toBe(200);
  }, 10000);

  it('should delete user', async () => {
    const token = jwt.sign({ userId: testUser.id }, 'arosaje');
    const response = await request(app)
      .delete('/deleteUser')
      .send({
        token: token,
      });

    expect(response.status).toBe(200);
  });
});
