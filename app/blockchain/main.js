const crypto = require('crypto'),
  SHA256 = (message) => crypto.createHash('sha256').update(message).digest('hex');

const fs = require('fs/promises');
const fsSync = require('fs');

class Block {
  constructor(timestamp = '', data = []) {
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.getHash();
    this.prevHash = '';
  }

  getHash() {
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data));
  }
}

class Blockchain {
  constructor() {
    const oldChain = fsSync.readFileSync('app/blockchain/log.json', 'utf8');
    this.chain = JSON.parse(oldChain);
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    block.prevHash = this.getLastBlock().hash;

    block.hash = block.getHash();

    this.chain.push(Object.freeze(block));

    this.updateChain();
  }

  isValid(blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const prevBlock = blockchain.chain[i - 1];

      if (prevBlock.hash !== currentBlock.prevHash) {
        return false;
      }
    }

    return true;
  }

  async updateChain() {
    try {
      if (this.isValid()) {
        await fs.writeFile('app/blockchain/log.json', JSON.stringify(this.chain));
      } else {
        throw new Error('Block not valid');
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const blockchain = new Blockchain();

module.exports = { blockchain, Block };
