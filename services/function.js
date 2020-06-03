
const nodemailer = require("nodemailer");
const User = require('../services/user');
process.env.ADMIN_EMAIL = '1760131bot@gmail.com';
process.env.ADMIN_PASSWORD = 'learnenglish';
process.env.BASE_URL = 'http://localhost:5000';
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to, subject, content, html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.ADMIN_EMAIL, // generated ethereal user
            pass: process.env.ADMIN_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Admin 👻" <${process.env.ADMIN_EMAIL}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: content, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}


module.exports = { sendMail, sendNews };