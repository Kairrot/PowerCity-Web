const nodemailer = require('nodemailer');

class MailManager {
    transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: 'powercity.mc@gmail.com',
                pass: 'Power123/w34'
            }
        })
    }

    sendMail(to ,subject, content) {
        this.transporter.sendMail({
            from: 'powercity.mc@gmail.com',
            to, subject, html: content
        }, (err, info) => {
            return !err;
        })
    }
}

module.exports = MailManager;
