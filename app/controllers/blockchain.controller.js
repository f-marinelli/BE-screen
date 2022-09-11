const fs = require('fs/promises');
const ncrypt = require('ncrypt-js');

const sendLog = async (req, res, next) => {
  const query = req.query;
  const password = req.get('password');

  if (password !== process.env.LOG_PASSWORD) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  try {
    const logsString = await fs.readFile('app/blockchain/log.json', 'utf8');
    const logsCrypt = JSON.parse(logsString);
    const ncryptObject = new ncrypt(process.env.CRYPT_KEY);

    let logs = logsCrypt.map((log) => {
      const decryptedObject = ncryptObject.decrypt(log.data);

      return { ...log, data: decryptedObject };
    });

    if (query.type) {
      logs = logs.filter((log) => log.data.type === query.type);
    }

    if (query.email) {
      logs = logs.filter((log) => log.data.user?.email === query.email);
    }

    res.json(logs);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendLog;
