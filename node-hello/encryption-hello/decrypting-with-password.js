const crypto = require('crypto');

// suggested cipher=[aes-256-cbc]
console.log(`crypto support ciphers: `, crypto.getCiphers());
let cipherAlgorithm = 'aes-256-cbc';
let keyLenInByte = 256/8; // bit to byte
const iv = Buffer.alloc(16, 0); // initialization vector (something like salt, no need to be hide/secret)

let symmetricKey = crypto.scryptSync('pass1234', 'salt-1234', keyLenInByte);
let decipher = crypto.createDecipheriv(cipherAlgorithm, symmetricKey, iv);

let encrypted = Buffer.from('AZi7o/Rmju5MMBMuAu8TspmhOfYZqC6e54OmaAvGBK8=', 'base64');
let decrypted = Buffer.alloc(4096); // just assume the size will be enough.
let writtenOffset = 0;

decipher.on('readable', () => {
  while (null !== (chunk = decipher.read())) {
    console.log(`chunk[to:${writtenOffset}][len=${chunk.length}] =`, 
      chunk.toString('hex'));
    chunk.copy(decrypted, writtenOffset);
    writtenOffset += chunk.length;
  }
});
decipher.write(encrypted);
decipher.end();
decrypted = decrypted.slice(0, writtenOffset);

console.log(`decryption done (size=${writtenOffset}).`);
console.log('decrypted = ['+decrypted.toString('utf-8')+']');
