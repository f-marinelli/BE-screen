const db = require('../services/firebase');
const nodemailer = require('nodemailer');

const sendMail = async (req, res, next) => {
  req.user.email = req.body.email;
  req.type = 'recover_password';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PSW,
    },
  });

  await transporter.sendMail({
    from: '"Screen Mailer" <screen.mailer.recover@gmail.com>',
    to: req.user.email,
    subject: 'Recover Password',
    text: `${process.env.FE_DOMAIN}/${req.user.accessToken}`,
    html: `<p>Click <a href="${process.env.FE_DOMAIN}/${req.user.accessToken}">here</a> to reset your password</p>`,
  });

  next();
};

const verifySignup = async (req, res, next) => {
  const user = await db.collection('users').where('email', '==', req.body.email).get();

  if (!user.empty) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  req.user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    APIKey: null,
  };

  await db.collection('users').add(req.user);

  req.type = 'sign_up';

  next();
};

const verifySignin = async (req, res, next) => {
  const user = await db.collection('users').where('email', '==', req.body.email).get();

  if (user.empty || user.docs[0].data().password.toString() !== req.body.password.toString()) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  req.user = user.docs[0].data();

  req.type = 'sign_in';

  next();
};

const updatePassword = async (req, res, next) => {
  const user = await db.collection('users').where('email', '==', req.body.email).get();

  if (user.empty) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  await db.collection('users').doc(user.docs[0].id).update({
    password: req.body.newPassword,
  });

  req.user = { ...req.user, ...user.docs[0].data(), password: req.body.newPassword };

  req.type = 'update_password';

  next();
};

const verifyPassword = async (req, res, next) => {
  const user = await db.collection('users').where('email', '==', req.body.email).get();

  if (user.empty) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  next();
};

module.exports = { verifySignup, verifySignin, updatePassword, sendMail, verifyPassword };
