const crypto = require('crypto');

// suggested cipher=[aes-256-cbc]
console.log(`crypto support ciphers: `, crypto.getCiphers());
let cipherAlgorithm = 'aes-256-cbc';
let keyLenInByte = 256/8; // bit to byte
const iv = Buffer.alloc(16, 0); // initialization vector (something like salt, no need to be hide/secret)

let symmetricKey = crypto.scryptSync('pass1234', 'salt-1234', keyLenInByte);
let cipher = crypto.createCipheriv(cipherAlgorithm, symmetricKey, iv);

let encrypted = Buffer.alloc(4096); // just assume the size will be enough.
let writtenOffset = 0;

cipher.on('readable', ()=>{
  let chunk; // in Buffer
  while (null !== (chunk = cipher.read())) {
    console.log(`chunk[to:${writtenOffset}][len=${chunk.length}] =`, 
      chunk.toString('hex'),
      chunk.toString('base64'),
    );
    chunk.copy(encrypted, writtenOffset);
    writtenOffset += chunk.length;
  }
});
cipher.write(Buffer.from('today is a good day.', 'utf-8'));
cipher.end();
encrypted = encrypted.slice(0, writtenOffset);

console.log(`encryption done (size=${writtenOffset}).`);
console.log('encrypted(base64) = ', encrypted.toString('base64'));
