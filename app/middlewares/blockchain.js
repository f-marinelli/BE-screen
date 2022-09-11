const { blockchain, Block } = require('../blockchain/main');
const ncrypt = require('ncrypt-js');

const addBlock = async (req, res, next) => {
  // const { username, email, password, APIKey } = req.user;
  // const user = { username, email, password, APIKey };

  // const ncryptObject = new ncrypt(process.env.CRYPT_KEY);

  // const encryptedObject = ncryptObject.encrypt(user);

  // const data = {
  //   encryptedObject,
  //   type: req.type,
  // };

  // const date = new Date();

  // blockchain.addBlock(new Block(date.toISOString(), data));
  const { username, email, password, APIKey } = req.user;

  const ncryptObject = new ncrypt(process.env.CRYPT_KEY);

  const data = {
    user: { username, email, password, APIKey },
    type: req.type,
  };

  const date = new Date();

  const encryptedObject = ncryptObject.encrypt(data);

  blockchain.addBlock(new Block(date.toISOString(), encryptedObject));

  next();
};

module.exports = addBlock;
