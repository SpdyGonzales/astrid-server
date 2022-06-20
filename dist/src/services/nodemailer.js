"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mailer = require("nodemailer");
const sendMail = (to, subject, html, res, text) => {
    /**
     * Future improvements would be to
     * add template repo for nicer presentation
     */
    const smtpTransport = mailer.createTransport({
        service: "Hotmail",
        auth: {
            user: process.env.MAILUSERNAME,
            pass: process.env.MAILPASS,
        },
    });
    const mail = {
        from: process.env.MAILUSERNAME,
        to: to,
        subject: subject,
        text: text,
        html: html,
    };
    smtpTransport.sendMail(mail, (error) => {
        if (error) {
            console.log(error);
            return res.status(404).json("Could not send challenge to email address");
        }
    });
    smtpTransport.close();
};
exports.sendMail = sendMail;
