const express = require('express');
const {
  verifySignup,
  verifySignin,
  updatePassword,
  sendMail,
  verifyPassword,
} = require('../middlewares/auth');
const { generateJwt, verifyToken, generateJwtPasswordRecover } = require('../middlewares/jwt');
const signController = require('../controllers/auth.controller');
const addBlock = require('../middlewares/blockchain');

const router = express.Router();

router.post('/signup', verifySignup, generateJwt);

router.post('/signin', verifySignin, generateJwt);

router.post('/recoverPassword', verifyPassword, generateJwtPasswordRecover, sendMail);

router.patch('/updatePassword', verifyToken, updatePassword);

router.use(addBlock, signController);

module.exports = router;
