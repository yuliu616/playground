const crypto = require('crypto');

/**
 * key pair generated using crypto.generateKeyPair()/crypto.generateKeyPairSync()
 * could be exported/imported as PEM.
 * but it is never same as key pair generated using ecdh.generateKeys()
 */

// suggested key type=[ec]
// suggested curve=[secp521r1]
console.log(`crypto support curves: `, crypto.getCurves());
let keyType = 'ec';
let curveName = 'secp521r1';

// generate a key pair (export as pem format)
let { privateKey, publicKey } = crypto.generateKeyPairSync(keyType, {
  namedCurve: curveName,
});
let privateKeyInPem = privateKey.export({
  type: 'pkcs8',
  format: 'pem',
});
let publicKeyInPem = publicKey.export({
  type: 'spki',
  format: 'pem',
});

console.log(`EC:privateKey(pem) =`, privateKeyInPem);
console.log(`EC:publicKey(pem) =`, publicKeyInPem);
