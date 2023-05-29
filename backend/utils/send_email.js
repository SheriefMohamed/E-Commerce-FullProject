const nodemailer = require('nodemailer');
// const sendGridTransport = require('nodemailer-sendgrid-transport');
const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sherieffool@gmail.com',
            pass: process.env.SENGRID_PASSWORD
        }
    });

    const message = {
        from: "sherieffool@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message);
}

module.exports = sendEmail;