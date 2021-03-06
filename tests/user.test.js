const request = require('supertest');
const app = require('../src/indexTests');
const { User } = require('../src/models/user');
const { testUserMeId, testUserMe, setupTestDb } = require('./fixtures/db');


beforeEach(setupTestDb);


test('should sign up new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'test user',
        email: 'testuser@example.com',
        password: 'testuser'
    }).expect(201);

    // assert db updated correctly (check for id)
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // other assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'test user',
            email: 'testuser@example.com',
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('testuser');
});

test('should not sign up new user without name field', async () => {
    const response = await request(app).post('/users').send({
        email: 'another.test.email@example.com',
        password: 'nonametestuser'
    }).expect(400);
});

test('should not sign up new user when submitted email already exists in db', async () => {
    const response = await request(app).post('/users').send({
        name: 'samuemail test user',
        email: 'david.dev.train@gmail.com',
        password: 'testuser'
    }).expect(400);
});

test('should not sign up new user without email field', async () => {
    const response = await request(app).post('/users').send({
        name: 'anothutest user',
        password: 'short'
    }).expect(400);
});

test('should not sign up new user with invalid email', async () => {
    const response = await request(app).post('/users').send({
        name: 'anothutest user',
        email: 'example.com',
        password: 'short'
    }).expect(400);
});

test('should not sign up new user where password length is less than 6 chars', async () => {
    const response = await request(app).post('/users').send({
        name: 'anothutest user',
        email: 'anothutest.user@example.com',
        password: 'short'
    }).expect(400);
});

test('should not sign up new user where password contains \'password\'', async () => {
    const response = await request(app).post('/users').send({
        name: 'anothutest user',
        email: 'anothutest.user@example.com',
        password: '22password22'
    }).expect(400);
});


test('should fail to login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'nosuchemail@example.com',
        password: 'nonexistentpw'
    }).expect(400);
});


test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: testUserMe.email,
        password: testUserMe.password
    }).expect(200);

    const user = await User.findById(testUserMeId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('should delete user account', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(testUserMeId);
    expect(user).toBeNull();
});

test('should not delete unauthenticated user account', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    
    const user = await User.findById(testUserMeId)
    expect(user.avatar).toEqual(expect.any(Buffer));// test avatar property for Buffer-ness
});

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .send({ name: 'david the testy' })
        .expect(200);

    const user = await User.findById(testUserMeId);
    expect(user.name).toBe('david the testy');
});

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .send({ location: 'no where' })
        .expect(400);
});