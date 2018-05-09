var nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    user: 'manoj.v111253@gmail.com',
    pass: '7607789271',

    transporter: nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host : 'smtp.gmail.com',
        secureConnection : false,
        auth : {
          user: 'manoj.v111253@gmail.com',
          pass: '7607789272',
        },

        tls: {
          rejectUnauthorized: false
      }
      }))
}