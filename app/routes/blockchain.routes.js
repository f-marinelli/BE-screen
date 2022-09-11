const express = require('express');
const sendLog = require('../controllers/blockchain.controller');

const router = express.Router();

router.get('/', sendLog);

module.exports = router;
