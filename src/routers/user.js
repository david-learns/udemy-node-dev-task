const express = require('express');
const { User } = require('../models/user');
const { userKeys } = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');


const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (file.originalname.match(/\.jpg$|\.jpeg$|\.png$/)) {
            cb(null, true);
        } else {
            cb(new Error('jpg, jpeg, and png of 1MB or less'));
        }
    }
});


router.post('/users', async (req, res) => {

    try {
        const user = new User(req.body);
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
    
});


router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send({ gandalf: err.message });
    }
});


router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }

});


router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});


router.get('/users/me', auth, async (req, res) => {

    res.send(req.user);

});


router.patch('/users/me', auth, async (req, res) => {

    try {

        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every(update => userKeys.includes(update));
        if (!isValidUpdate) throw new Error('invalid update request');
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);

    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});


router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();

}, (err, req, res, next) => {
    res.status(400).send({ error: err.message });
});


router.delete('/users/me/avatar', auth, async (req, res) => {

    try {
        req.user.avatar = null;
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});


router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send();
    }
});


module.exports = router;