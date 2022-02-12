'use strict';
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Task } = require('../models/task');


const userSchemaDefinition = {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: null,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be positive number')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('password contains \'password\'')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    },
};


const userSchemaOptions = {
    timestamps: true,
};


const userSchema = new mongoose.Schema(userSchemaDefinition, userSchemaOptions);


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});


userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('you shall not pass');
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('you shall not pass');
        }
        return user;
    }
}


userSchema.methods.toJSON = function () {
    
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}


userSchema.methods.generateAuthToken = async function () {

    const user = this;
    const token = jwt.sign({ _id: user._id }, 'this-is-the-secret');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}


userSchema.pre('save', async function (next) {

    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});


userSchema.pre('remove', async function (next) {
    
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});


const User = mongoose.model('User', userSchema);


User.createIndexes();


const userKeys = Object.keys(userSchemaDefinition);


module.exports = {
    userKeys,
    User,
}