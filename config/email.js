var nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    user: '<your email_id>',
    pass: '<your password>',

    transporter: nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host : 'smtp.gmail.com',
        secureConnection : false,
        auth : {
           user: '<your email_id>',
           pass: '<your password>',
        },

        tls: {
          rejectUnauthorized: false
      }
      }))
}
