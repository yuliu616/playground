const otplib = require('otplib');
const moment = require('moment');
const qrcode = require('qrcode');

if (process.argv.includes("--help")) {
  console.log(`supported options:
    --fixedTime
    --fixedSecret
    --hideQrCodeDataUrl
  `);
  process.exit(0);
}
let useCurrentTime = !process.argv.includes("--fixedTime");
let useManualSecret = process.argv.includes("--fixedSecret");
let hideQrCodeDataUrl = process.argv.includes("--hideQrCodeDataUrl");

if (useCurrentTime) {
  // use current time
  otplib.authenticator.options = {
    step: 30,
    window: 1,
    // epoch: 1531041010, //optional
    // encoding: 'ascii', // ascii, base64, hex, latin1 or utf8.
  };
  let refTime = moment();
  let refTimeInEpoch = refTime.unix();
  console.log(`current time = ${refTime.format()} or ${refTimeInEpoch}.`);
  
} else {
  // override current time.
  let refTime = moment({
    year: 2018,
    month: 7-1,
    date: 8,
    hour: 17,
    minute: 12,
    second: 10
  });
  let refTimeInEpoch = refTime.unix();
  
  otplib.authenticator.options = {
    step: 30,
    window: 1,
    epoch: refTimeInEpoch * 1000,
    // encoding: 'ascii', // ascii, base64, hex, latin1 or utf8.
  };
  console.log(`fixed time = ${refTime.format()} or ${refTimeInEpoch}.`);

}

function genBase32(len){
  if (!len) {
    len = 32;
  }

  let sb = [];
  for (let i=0;i<len;i++) {
    let c = Math.floor(Math.random()*32);
    sb.push(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`.charAt(c));
  }
  return sb.join("");
}

let secret;
if (useManualSecret) {
  // secret = genBase32();
  secret = 'OR5FI5SRKQZTA52PLAZESMLEIEZHM52S'; // base32 encoded byte array with length 32.
  console.log(`with fixed secret: [${secret}]`);
} else { // useManualSecret == false
  secret = otplib.authenticator.generateSecret();
  console.log(`with generated secret: [${secret}]`);
}

let token = otplib.authenticator.generate(secret);
console.log(`token = ${token}`);

let otpProvider = "HelloTotp";
let otpIssuer = "HelloLtd";
let otpAccountName = "yourName@nowhere.com"; // for that user account
// let qrCodeUrl = `otpauth://totp/HelloTotp:yourName@nowhere.com?issuer=HelloLtd&secret=${secret}`;
let qrCodeUrl = `otpauth://totp/${otpProvider}:${otpAccountName}?issuer=${otpIssuer}&secret=${secret}`;
console.log(`QR Code URL: ${qrCodeUrl}`);

if (!hideQrCodeDataUrl) {
  qrcode.toDataURL(qrCodeUrl, (err, imageUrl)=>{
    console.log(`QR Code encoded as image data url:`, imageUrl);
  });
}
