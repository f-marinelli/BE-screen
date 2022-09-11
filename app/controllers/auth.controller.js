const signController = (req, res) => {
  res.json({
    ...req.user,
  });
};

module.exports = signController;
