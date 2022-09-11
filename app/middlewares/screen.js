const db = require('../services/firebase');

const verifyKey = async (req, res, next) => {
  const apiKey = req.body.apiKey;

  if (!apiKey) {
    return res.status(403).json({
      message: 'No Key provided!',
    });
  }

  const user = await db.collection('users').where('APIKey', '==', apiKey).get();

  if (user.empty) {
    return res.status(403).json({
      message: 'Key not valid!',
    });
  }

  next();
};

module.exports = { verifyKey };
