import express from 'express';

const router = express.Router();
const healthCheck = require('./healthCheck');
const signup = require('./signup');
const login = require('./login');
const projects = require('./projects');

router.use('/health', healthCheck);
router.use('/signup', signup);
router.use('/login', login);
router.use('/projects', projects);

module.exports = router;
