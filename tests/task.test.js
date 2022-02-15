const request = require('supertest');
const app = require('../src/indexTests');
const { Task } = require('../src/models/task');
const {
    testUserMeId,
    testUserMe,
    testUserId,
    testUser,
    testTask_1,
    setupTestDb
} = require('./fixtures/db');


beforeEach(setupTestDb);


test('should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .send({
            description: 'test test test and more tests'
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false)
});

test('should get two tasks returned for testUserMe', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUserMe.tokens[0].token}`)
        .send()
        .expect(200);
    
    expect(response.body.length).toBe(2);
});

test('should not delete task with different owner', async () => {
    const response = await request(app)
        .delete(`/tasks/${testTask_1._id}`)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(testTask_1._id);
    expect(task).not.toBeNull();
    
});