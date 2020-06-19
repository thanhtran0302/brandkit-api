import express from 'express';

const router = express.Router();
const healthCheck = require('./healthCheck');
const signup = require('./signup');
const login = require('./login');
const projects = require('./projects');
const persona = require('./persona');
const visions = require('./visions');

router.use('/health', healthCheck);
router.use('/signup', signup);
router.use('/login', login);
router.use('/projects', projects);
router.use('/persona', persona);
router.use('/visions', visions);

module.exports = router;
