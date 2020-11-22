const crypto = require('crypto');

/**
 * only EC key pair generated using ecdh.generateKeys() 
 * works for this flow.
 */

// suggested key type=[ec]
// suggested curve=[secp521r1]
console.log(`crypto support curves: `, crypto.getCurves());
let keyType = 'ec';
let curveName = 'secp521r1';

// privateKeyInBufferAsBase64 should be generated using 'ecdh.generateKeys' (buffer) and stored in base64
// publicKeyInBufferAsBase64 should be generated using 'ecdh.generateKeys' (buffer) and stored in base64
let privateKey1InBufferAsBase64 = 
  'GRxHKor5ea/le+lrUcKY3rS94qPta85fT3/h39XzBJc68HS4/80gyGxQztbAqfopJijiLkgITofaObZUvUyBNZ8=';
let publicKey1InBufferAsBase64 = 
  'BABFY2d7fF7Kxxug7kv+PX84FcVB00FxMFRQSy2y+jYUsD/mSxY3xO7x1b4tWGmU6nno6Vix6nu/nMpQp4Eer9BR/QGr4I1pHLntNNx+zuvnK5Bir6GarKzf8nzNaaesdoCu2DZeVl1Aza1AgQ7YZUYl8hZm9kJaYmiWcT74tDwnQO6LOg==';
let privateKey2InBufferAsBase64 = 
  'AV003/tfog6w/KnKIFw9ObGxO9wYQE+5hffLrCvV6qXrwd/RzGMUDvedcMavmIYyFVNdvcTwmbGygYAodJFqnrTz';
let publicKey2InBufferAsBase64 = 
  'BAF+Hy1b0zEAQJam5sNQeSG6CcCF4oVkPZRy+1W46YgvnTBtRFYSirOWyz4qhq8pgGG/ykwdmc5m+gsUFY9/W7V1fQFIFIUo63slOIBDMyxovcejWZsBxv3TJbxz5PGe8DeUOD80MUsBOosBx2t95FSmEcjlhDvAhabtyxFgU78KN4IdHQ==';

let ecdh1 = crypto.createECDH(curveName);
ecdh1.setPrivateKey(Buffer.from(privateKey1InBufferAsBase64, 'base64'));
let party1PrivateKeyInBuffer = ecdh1.getPrivateKey();
let party1PublicKeyInBuffer = Buffer.from(publicKey1InBufferAsBase64, 'base64');

let ecdh2 = crypto.createECDH(curveName);
ecdh2.setPrivateKey(Buffer.from(privateKey2InBufferAsBase64, 'base64'));
let party2PrivateKeyInBuffer = ecdh2.getPrivateKey();
let party2PublicKeyInBuffer = Buffer.from(publicKey2InBufferAsBase64, 'base64');

// the shared secret will be the same for either:
// "private key of party-1 + public key of party-2", or,
// "private key of party-2 + public key of party-1".
let sharedSecretOneToTwoInBuffer = ecdh1.computeSecret(party2PublicKeyInBuffer);
console.log(`sharedSecret party 1-to-2: len =`, // 66 bytes
  sharedSecretOneToTwoInBuffer.length, ', base64 =',
  sharedSecretOneToTwoInBuffer.toString('base64'), sharedSecretOneToTwoInBuffer);

let sharedSecretTwoToOneInBuffer = ecdh2.computeSecret(party1PublicKeyInBuffer);
console.log(`sharedSecret party 2-to-1: len =`, // 66 bytes
  sharedSecretTwoToOneInBuffer.length, ', base64 =',
  sharedSecretTwoToOneInBuffer.toString('base64'));
