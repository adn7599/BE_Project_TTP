/* 
    Public key length 130 in hex
    Private key length 64 in hex
*/

const crypto = require("crypto");
const EC = require("elliptic").ec;

const SERVER_SEC_KEY =
  "a7856eed47ff9bfffd19c196c62c2cb6e8ada60f061126ab425e940792e7e8c0";
const SERVER_SEC_IV = "b5d8cf2152b354e84acf8b91";

const secKey = Buffer.from(SERVER_SEC_KEY, "hex");
const secIV = Buffer.from(SERVER_SEC_IV, "hex");

const ecdsa = new EC("secp256k1");

function generateKeyPair() {
  return new Promise((resolve, reject) => {
    let keys = ecdsa.genKeyPair();
    let publicKey = keys.getPublic("hex");
    let privateKey = keys.getPrivate("hex");


    encryptWithAes(privateKey)
      .then((encPrivateKey) => {
        resolve({
          publicKey,
          encPrivateKey,
        });
      })
      .catch((err) => {
        throw err;
      });
  });
}

function signMessage(hash, encPrivateKey) {
  return new Promise((resolve, reject) => {
    decryptWithAes(encPrivateKey)
      .then((privateKey) => {
        let key = ecdsa.keyFromPrivate(privateKey, "hex");
        let sign = key.sign(hash).toDER("hex");

        resolve(sign);
      })
      .catch((err) => {
        throw err;
      });
  });
}

function verifyMessage(hash, sign, publicKey) {
  let key = ecdsa.keyFromPublic(publicKey, "hex");
  let verify = key.verify(hash, sign);

  return verify;
}

function generateRelayPassword() {
  return crypto.randomBytes(6).toString("hex");
}

const encryptWithAes = (text) => {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv("aes-256-gcm", secKey, secIV);

    cipher.write(text, "hex", (err) => {
      if (!err) {
        let ct = cipher.read().toString("hex");

        cipher.end(() => {
          resolve(ct);
        });
      } else {
        throw err;
      }
    });
  });
};

const decryptWithAes = (text) => {
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipheriv("aes-256-gcm", secKey, secIV);

    decipher.write(text, "hex", (err) => {
      if (!err) {
        let pt = decipher.read().toString("hex");
        //decipher.end()
        resolve(pt);
      } else {
        throw err;
      }
    });
  });
};

module.exports = { generateKeyPair, signMessage, verifyMessage, generateRelayPassword}
/*
//Testing
console.log(generateRelayPassword());
let keys;
generateKeyPair()
  .then((val) => {
    keys = val;
    console.log(val);
    signMessage("Hello world", keys.encPrivateKey)
      .then((sign) => {
        console.log("Sign: ", sign);
        console.log(verifyMessage("Hello world", sign, keys.publicKey));
        console.log(verifyMessage("Hellaso world", sign, keys.publicKey));
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => console.log(err));
*/
