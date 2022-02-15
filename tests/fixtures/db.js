
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User } = require('../../src/models/user');
const { Task } = require('../../src/models/task');



const testUserMeId = new mongoose.Types.ObjectId();
const testUserMe = {
    _id: testUserMeId,
    name: 'test-david',
    email: 'david.dev.train@gmail.com',
    password: 'david.dev',
    tokens: [{
        token: jwt.sign({ _id: testUserMeId }, process.env.JWT_SECRET)
    }]
};


const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: 'test-user',
    email: 'test.user@example.com',
    password: 'test.user',
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
    }]
};


const testTask_1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test task one',
    completed: false,
    owner: testUserMeId
};


const testTask_2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test task two',
    completed: true,
    owner: testUserMeId
};


const testTask_3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test task three',
    completed: true,
    owner: testUserId
};


const setupTestDb = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(testUserMe).save();
    await new User(testUser).save();
    await new Task(testTask_1).save();
    await new Task(testTask_2).save();
    await new Task(testTask_3).save();
}


module.exports = {
    testUserMeId,
    testUserMe,
    testUserId,
    testUser,
    testTask_1,
    setupTestDb,
}