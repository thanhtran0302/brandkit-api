import express from 'express';

const router = express.Router();
const healthCheck = require('./healthCheck');
const signup = require('./signup');
const login = require('./login');
const intime = require('./private');

router.use('/health', healthCheck);
router.use('/signup', signup);
router.use('/login', login);
router.use('/private', intime);

module.exports = router;
