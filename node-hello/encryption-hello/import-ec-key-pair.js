const crypto = require('crypto');

// privateKeyInPem should be exported using 'pkcs8' with format='pem'
// publicKeyInPem should be exported using 'spki' with format='pem'
let privateKeyInPem = `
-----BEGIN PRIVATE KEY-----
MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBg9Z+WQwRjj0HJtMs
Gjyq1eXUThc8CHl+IOpxT1lubVi1js8c5z8mJHZnUG6ZQRyLhKYxTgRlfjLitYG/
51s9TNGhgYkDgYYABAAYuAccBBRyqgRzqRX1KzASBqggLr1CIGVFCCkdMM/72HuK
+xExQ3y/tR4ZLCcYlwerjOcxpwm5i/rgF69G6dgPqAEpYEWX/YMvA7jPd6B1G+dX
OQG37QPwyN8cBvAcLJoP/8SOp/U/17KoqJuKGnTpvKqx5DiVdFTvIoPxqdiVfOng
lw==
-----END PRIVATE KEY-----
`;
let publicKeyInPem = `
-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAGLgHHAQUcqoEc6kV9SswEgaoIC69
QiBlRQgpHTDP+9h7ivsRMUN8v7UeGSwnGJcHq4znMacJuYv64BevRunYD6gBKWBF
l/2DLwO4z3egdRvnVzkBt+0D8MjfHAbwHCyaD//Ejqf1P9eyqKibihp06byqseQ4
lXRU7yKD8anYlXzp4Jc=
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
