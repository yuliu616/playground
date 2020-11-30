'use strict'; 
 
let jwt = require('jsonwebtoken'); 
let fs = require('fs');

let algorithm_for_jwt = 'ES256';
let issuer_for_jwt = 'yoursite.com'; 
let valid_duration_of_jwt = '1d';

// key pair is generated using EC(curve=secp521r1) and exported as PEM.
// privateKeyInPem should be exported using 'pkcs8' with format='pem'
// publicKeyInPem should be exported using 'spki' with format='pem'
let privateKeyInPem = `
-----BEGIN PRIVATE KEY-----
MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgjZ+mQMBI3V/BRfTM4Rx2
0oiqtdUw7j6mPi5wg+AgROihRANCAAT4W3cDMH7EE1qgE5hTR+Pf6YCesz5pggDw
xVlX+zbyofqYZxR+uoacoy7u34RWZM/R/dEY53qw7UCeGyqQvMKt
-----END PRIVATE KEY-----
`;
let publicKeyInPem = `
-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE+Ft3AzB+xBNaoBOYU0fj3+mAnrM+aYIA
8MVZV/s28qH6mGcUfrqGnKMu7t+EVmTP0f3RGOd6sO1AnhsqkLzCrQ==
-----END PUBLIC KEY-----
`;
 
let claims = { 
  "user": { "username": 'user1001' },
  "role": [ "SUPER_ADMIN", "USER_ADMIN" ],
}; 
let token = jwt.sign(claims, privateKeyInPem, { 
  algorithm: algorithm_for_jwt, 
  expiresIn: valid_duration_of_jwt, 
  issuer: issuer_for_jwt 
}); 
console.log('JWT Token for claims =',  claims);
console.log('token =', token); 

//it printout like this:
// token = eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlcjEwMDEifSwicm9sZSI6WyJTVVBFUl9BRE1JTiIsIlVTRVJfQURNSU4iXSwiaWF0IjoxNjA2NzI2NTg1LCJleHAiOjE2MDY4MTI5ODUsImlzcyI6InlvdXJzaXRlLmNvbSJ9.ws65gTijZxGWMUFlySnFeZdWeHO8LXWET6pHJPo4k6uw7TRhgdCc1WsAOzf-KK3yh1b6DDfj-aOeiJ4y4b85Qg
