const crypto = require('crypto');

// suggested key type=[ec]
// suggested hash=[sha512]
console.log(`crypto support hashes: `, crypto.getHashes());
let hashAlgorithm = 'sha512';

// privateKeyInPem should be exported using 'pkcs8' with format='pem'
// publicKeyInPem should be exported using 'spki' with format='pem'
let privateKeyInPem = `
-----BEGIN PRIVATE KEY-----
MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIAhth0Ke4MPML7VP7h
ZG+FuZzLkVPWcbuMnlRUPbU68YwYYlBQn02q2+pa9ocOXFFOjp5H08lfK1D2aO6p
v3X0e52hgYkDgYYABAGEPdAzVIDQnS5sVS8cajgaAeDr8W3YKCPKN4cK4gJJcMwN
sOAXC7ZCLOghWCwmILKgW6sjCO2IUuobMDDrzJ+65gE8XP7Gj8BIoG5L5tz/w5dh
RpDC0FjlpV0/2njI1E5z/7RRWlAiOjMp96h9NKi3SgyozNTWnzqNWacD2PhvxXfy
rQ==
-----END PRIVATE KEY-----
`;
let publicKeyInPem = `
-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBhD3QM1SA0J0ubFUvHGo4GgHg6/Ft
2CgjyjeHCuICSXDMDbDgFwu2QizoIVgsJiCyoFurIwjtiFLqGzAw68yfuuYBPFz+
xo/ASKBuS+bc/8OXYUaQwtBY5aVdP9p4yNROc/+0UVpQIjozKfeofTSot0oMqMzU
1p86jVmnA9j4b8V38q0=
-----END PUBLIC KEY-----
`;
let privateKey = crypto.createPrivateKey({
  key: privateKeyInPem,
  type: 'pkcs8',
  format: 'pem',
});
let publicKey = crypto.createPublicKey({
  key: publicKeyInPem,
  type: 'spki',
  format: 'pem',
});

console.log(`EC:privateKey(pem) =`, privateKeyInPem);
console.log(`EC:publicKey(pem) =`, publicKeyInPem);

let signInBuffer = crypto.sign(hashAlgorithm, 
  Buffer.from('You Are The Best', 'utf-8'), 
  privateKeyInPem);
console.log(`sign(base64) of "You Are The Best" with hashing=${hashAlgorithm}:\n  `,
  signInBuffer.toString('base64'));

let isSignValid = crypto.verify(hashAlgorithm, 
  Buffer.from('You Are The Best', 'utf-8'), 
  publicKeyInPem, signInBuffer);
console.log(`is sign valid ?`, (isSignValid?'Y':'N'));
