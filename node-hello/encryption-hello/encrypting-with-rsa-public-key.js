const crypto = require('crypto');

/**
 * RSA support privateEncrypt/publicEncrypt, privateDecrypt but not publicDecrypt.
 */

// suggested key type=[RSA] (EC wont support privateEncrypt/publicEncrypt)

// privateKeyInPem should be exported using 'pkcs8' with format='pem'
// publicKeyInPem should be exported using 'spki' with format='pem'
let privateKeyInPem = `
-----BEGIN PRIVATE KEY-----
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
Glr6+tNUa+dS0OPNJqaGBbr1isIUgw==
-----END PRIVATE KEY-----
`;
let publicKeyInPem = `
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsMkKB0JePt6v2n8Pk1dM
WLo4mdcMQuHPgMJ8IBjfTBYrN2AWO4K9a3Xe8JY6xi166iWnTg6Vxe84KeAfbAa4
ZG7F9x1SoSZ7AkUOjnMF0wPZtI188s19DMfGIwQ5JvELmNRieZMBrcB9X0w8hPb4
eC/Or/IYBdS+i5U4tCUee2QvOjCBP2t0oXnYJwycVSLJDDOxsLdNENl7FeWAJ7hd
213il2sNwLrf5mdImSy7mIsNNhOtKVNET7QylaYWxwd4nwnK8LRs57C0IgkMuqxP
e6svvF6QQ/kR37wn9ptxHw4/t2T3By/Hh0SxqwSWE2LbQLTaaRsCHiq+eDuZw+oB
x/BArsplkM23RFU17164hPPVSAF430TX1Is/kw4vjWD6O710rzD32H51HxR1cEX5
WYVz8ldwybM2Fn6Z4ja6f7AB40WvhZpk7X5Wxbz+uytVXaHMVpv/NCPMZZRWR3e8
tH4Nqkz+rLoq4A2oizpBPoKtfiFPO4jB7f82HN2jVwDORRf8h+MoxaLdGrN2dtMT
WhAgNjqLTutQ8I2G9IZ9vyEDKnEjwvMZualtNo6+gNU5Kbg+JsiAYgey7L6soKP/
Q7URW2C22v74/EWEsT/LUvlRqrb/b+eDXkFHp1doB1MYj2Dxk99W6ezxDzt/mcoS
vRBuBKDT+J+xWfI8R+5bJdMCAwEAAQ==
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

// console.log(`RSA:privateKey(pem) =`, privateKeyInPem);
// console.log(`RSA:publicKey(pem) =`, publicKeyInPem);

let encrypted = crypto.publicEncrypt(publicKey, Buffer.from('you are amazing.', 'utf-8'));
console.log(`encryption (using public key) done (size=${encrypted.length}).`);
console.log('encrypted(base64) = ', encrypted.toString('base64'));
