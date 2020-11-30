'use strict'; 
 
let jwt = require('jsonwebtoken'); 
let fs = require('fs');

let algorithm_for_jwt = 'ES256';
let issuer_for_jwt = 'yoursite.com'; 
let valid_duration_of_jwt = '1d';

// key pair is generated using EC(curve=secp521r1) and exported as PEM.
// privateKeyInPem should be exported using 'pkcs8' with format='pem'
// publicKeyInPem should be exported using 'spki' with format='pem'
let publicKeyInPem = `
-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE+Ft3AzB+xBNaoBOYU0fj3+mAnrM+aYIA
8MVZV/s28qH6mGcUfrqGnKMu7t+EVmTP0f3RGOd6sO1AnhsqkLzCrQ==
-----END PUBLIC KEY-----
`;
 
let token = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlcjEwMDEifSwicm9sZSI6WyJTVVBFUl9BRE1JTiIsIlVTRVJfQURNSU4iXSwiaWF0IjoxNjA2NzI2NTg1LCJleHAiOjE2MDY4MTI5ODUsImlzcyI6InlvdXJzaXRlLmNvbSJ9.ws65gTijZxGWMUFlySnFeZdWeHO8LXWET6pHJPo4k6uw7TRhgdCc1WsAOzf-KK3yh1b6DDfj-aOeiJ4y4b85Qg";

let decodedToken = jwt.verify(token, publicKeyInPem, {
  algorithms: [algorithm_for_jwt],
  issuer: issuer_for_jwt
}); 
 
console.log('algorithm_for_jwt = ', algorithm_for_jwt);
console.log('decodedToken = ', decodedToken);

//it printout like this:
// decodedToken =  {
//   user: { username: 'user1001' },
//   role: [ 'SUPER_ADMIN', 'USER_ADMIN' ],
//   iat: 1606723814,
//   exp: 1606810214,
//   iss: 'yoursite.com'
// }
