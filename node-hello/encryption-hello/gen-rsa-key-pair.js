const crypto = require('crypto');

// for times that EC wont support (like privateEncrypt/publicEncrypt)
let keyType = 'rsa';
let rsaModLen = 4096;

// generate a key pair (export as pem format)
let { privateKey, publicKey } = crypto.generateKeyPairSync(keyType, {
  modulusLength: rsaModLen,
});
let privateKeyInPem = privateKey.export({
  type: 'pkcs8',
  format: 'pem',
});
let publicKeyInPem = publicKey.export({
  type: 'spki',
  format: 'pem',
});

console.log(`RSA:privateKey(pem) =`, privateKeyInPem);
console.log(`RSA:publicKey(pem) =`, publicKeyInPem);
