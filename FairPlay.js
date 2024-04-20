const crypto = require('crypto');

class FairPlay {
    #genKey() {
        this.key = crypto.randomBytes(32).toString('hex');
    }

    showKey() {
        console.log(`HMAC key: ${this.key}`);
    }

    genHmac(move) {
        this.#genKey();
        const hmac = crypto.createHmac('sha3-256', this.key);
        return hmac.update(move).digest('hex');
    }
}

module.exports = FairPlay;