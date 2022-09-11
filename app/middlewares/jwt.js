const jwt = require('jsonwebtoken');

const generateJwt = (req, res, next) => {
  const token = jwt.sign(
    { username: req.user.username, email: req.user.email, password: req.user.password },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400,
    }
  );

  req.user.accessToken = token;

  next();
};

const generateJwtPasswordRecover = (req, res, next) => {
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });

  req.user = { accessToken: token };

  next();
};

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized!',
      });
    }

    const { username, password, email } = decoded;

    req.user = { username, password, email, accessToken: token };

    next();
  });
};

module.exports = { generateJwt, verifyToken, generateJwtPasswordRecover };
