import { Response } from "express";

const mailer = require("nodemailer");

export const sendMail = (
  to: string,
  subject: string,
  html: string,
  res: Response,
  text?: string
) => {
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

  smtpTransport.sendMail(mail, (error: Error) => {
    if (error) {
      console.log(error);
      return res.status(404).json("Could not send challenge to email address");
    }
  });

  smtpTransport.close();
};
