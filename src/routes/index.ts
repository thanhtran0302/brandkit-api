import express from 'express';

const router = express.Router();
const healthCheck = require('./healthCheck');

router.use('/health', healthCheck);

module.exports = router;
