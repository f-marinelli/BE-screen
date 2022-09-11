const express = require('express');
const { verifyToken } = require('../middlewares/jwt');
const { createKey } = require('../middlewares/stripe');
const { redirectFE, initSessionStripe } = require('../controllers/stripe.controller');
const addBlock = require('../middlewares/blockchain');

const router = express.Router();

router.post('/', verifyToken, initSessionStripe);

router.get('/:token', createKey, addBlock, redirectFE);

module.exports = router;
