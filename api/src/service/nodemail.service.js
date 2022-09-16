// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

export default async function(receivers, subject, text, html)
{

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "intech-flightsell-simajchel-goni-serhat-villalonga@outlook.com", // generated ethereal user
          pass: "blabla!!" , // generated ethereal password
        },
    });

    return await transporter.sendMail({
      from: '"FlightSell" <intech-flightsell-simajchel-goni-serhat-villalonga@outlook.com>', // sender address
      to: receivers, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
}

// module.exports = nodeMailService;