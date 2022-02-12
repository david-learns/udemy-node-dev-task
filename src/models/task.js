'use strict';
const mongoose = require('mongoose');


const taskSchemaDefinition = {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
};


const taskSchemaOptions = {
    timestamps: true,
};


const taskSchema = mongoose.Schema(taskSchemaDefinition, taskSchemaOptions);


const Task = mongoose.model('Task', taskSchema);


const taskKeys = Object.keys(taskSchemaDefinition);


module.exports = {
    taskKeys,
    Task
}