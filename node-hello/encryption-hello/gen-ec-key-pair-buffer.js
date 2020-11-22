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
let ecdh = crypto.createECDH(curveName);
let publicKeyInBufferAsBase64 = ecdh.generateKeys('base64', 'uncompressed');
let privateKeyInBufferAsBase64 = ecdh.getPrivateKey('base64');

console.log(`EC:privateKey(buffer as base64) =`, privateKeyInBufferAsBase64);
console.log(`EC:publicKey(buffer as base64) =`, publicKeyInBufferAsBase64);
