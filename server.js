require('dotenv').config();
const cors = require('cors');
const express = require('express');
const authRouter = require('./app/routes/auth.routes');
const stripeRouter = require('./app/routes/stripe.routes');
const screenRouter = require('./app/routes/screen.routes');
const blockchainRouter = require('./app/routes/blockchain.routes');

const app = express();

const corsOptions = {
  origin: process.env.FE_DOMAIN,
  methods: ['GET', 'POST', 'PATCH'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRouter);
app.use('/stripe', stripeRouter);
app.use('/screen', screenRouter);
app.use('/blockchain', blockchainRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server up on port: ${process.env.PORT}`);
});
