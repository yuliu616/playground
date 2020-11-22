let nodemailer = require('nodemailer');

let smtpHost = '127.0.0.1';
let smtpPort = '2025';

let mailer = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  // auth: {
  //   user: 'yu@gmail.com',
  //   pass: 'pass1234'
  // }
});

mailer.sendMail({
  from: 'info@yu.com',
  to: 'myfriend@yu.com',
  subject: 'long time no see',
  html: true,
  html: `
<html>
  <body>
    hi, i am <font color='red'>very happy</font> to tell you, you got a prize.
    please call <a href='tel:1083'>this</a> to discuss how to get it.
  </body>
</html>
`
}, (error, info)=>{
  if (error) {
    console.error(error);
    throw error;
  }

  console.log('email sent successfully.', info);
});

mailer.sendMail({
  from: 'info@yu.com',
  to: 'myfriend@yu.com',
  subject: 'long time no see (plain text mode)',
  html: false,
  text: `
hi, i am VERY HAPPY to tell you, you got a prize.
please call (tel)1083 to discuss how to get it.
`
}, (error, info)=>{
  if (error) {
    console.error(error);
    throw error;
  }

  console.log('email sent successfully.', info);
});
