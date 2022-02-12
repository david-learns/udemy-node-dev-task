const express = require('express');
const { Task } = require('../models/task');
const { taskKeys } = require('../models/task');
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const router = new express.Router();


router.post('/tasks', auth, async (req, res) => {

    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});


router.get('/tasks', auth, async (req, res) => {

    try {
        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit) || null,
                skip: parseInt(req.query.skip) || null,
                sort,
            }
        });
        res.send(req.user.tasks);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});


router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const _id = req.params.id;
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            res.status(404).send({});
        } else {
            res.send(task);
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});


router.patch('/tasks/:id', auth, async (req, res) => {

    try {
        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every(update => taskKeys.includes(update));
        if (!isValidUpdate) throw new Error('invalid update request');
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send({});
        } else {
            updates.forEach(update => task[update] = req.body[update]);
            await task.save();
            res.send(task);
        }
    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});


router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send({});
        } else {
            res.send(task);
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});


module.exports = router;