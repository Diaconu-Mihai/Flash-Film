const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../backend/server');
const fileReaderAsync = require('../backend/fileReader');

describe('POST /newuser', () => {
  let initialData;
  const accountsFilePath = path.join(__dirname, '../backend/accounts.json');
  const newUser = {
    name: 'Test',
    surname: 'User',
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Test1234',
    favmovies: []
  };

  beforeAll(async () => {
    initialData = await fileReaderAsync(accountsFilePath);
  });

  afterAll(() => {
    fs.writeFileSync(accountsFilePath, JSON.stringify(initialData, null, 2), 'utf8');
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/newuser')
      .send(newUser);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.user).toMatchObject({
      name: 'Test',
      surname: 'User',
      username: 'testuser',
      email: 'testuser@example.com'
    });

    const data = await fileReaderAsync(accountsFilePath);
    const user = data.users.find(u => u.username === 'testuser');
    expect(user).toBeTruthy();
    expect(user).toMatchObject({
      name: 'Test',
      surname: 'User',
      username: 'testuser',
      email: 'testuser@example.com'
    });
  });
});

