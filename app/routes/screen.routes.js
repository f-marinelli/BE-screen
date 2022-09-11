const express = require('express');
const { verifyKey } = require('../middlewares/screen');
const { screenshot } = require('../controllers/screen.controller');

const router = express.Router();

router.post('/', verifyKey, screenshot);

module.exports = router;
