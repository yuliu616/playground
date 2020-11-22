const crypto = require('crypto');

// suggested hash=[sha512]
console.log(`crypto support hashes: `, crypto.getHashes());
let hashAlgorithm = 'sha512';

let hashing = crypto.createHash(hashAlgorithm);
let hashInBase64 = hashing.update('You Are The Best', 'utf8').digest('base64');
console.log(`hash of "You Are The Best" with hashing=${hashAlgorithm}:\n  `, hashInBase64);
