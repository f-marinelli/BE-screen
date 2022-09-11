const stripe = require('stripe')(process.env.STRIPE_KEY);

const redirectFE = (req, res) => {
  res.redirect(`${process.env.FE_DOMAIN}/?success=true`);
};

const initSessionStripe = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1LEFEmI4iDsRIwWmqmxcNt0D',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.BE_DOMAIN}/stripe/${req.headers['x-access-token']}`,
    cancel_url: `${process.env.FE_DOMAIN}/?canceled=true`,
    metadata: {
      email: req.user.email,
    },
  });

  res.json({ url: session.url });
};

module.exports = { redirectFE, initSessionStripe };
