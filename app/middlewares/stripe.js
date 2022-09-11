const stripe = require('stripe')(process.env.STRIPE_KEY);
const jwt = require('jsonwebtoken');
const db = require('../services/firebase');

const createKey = async (req, res, next) => {
  const token = req.params.token;

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized!',
      });
    }

    req.user = {
      email: decoded.email,
      username: decoded.username,
      password: decoded.password,
    };
  });

  const session = await stripe.checkout.sessions.list({
    limit: 5,
  });

  const key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

  session.data.forEach(async (data) => {
    if (data.status === 'complete' && req.user.email === data.metadata.email) {
      const userDb = await db.collection('users').where('email', '==', req.user.email).get();

      await db.collection('users').doc(userDb.docs[0].id).update({
        APIKey: key,
      });
    }
  });

  req.user = {
    ...req.user,
    APIKey: key,
    accessToken: token,
  };

  req.type = 'stripe';
  next();
};

module.exports = { createKey };
