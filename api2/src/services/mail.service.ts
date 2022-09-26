import nodemailer from "nodemailer";

class MailService {
    async sendMail(receivers: string, subject: string, text: string) {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "intech-flightsell-simajchel-goni-serhat-villalonga@outlook.com", // generated ethereal user
                    pass: "blabla!!", // generated ethereal password
                },
            });

            await transporter.sendMail({
                from: '"FlightSell" <intech-flightsell-simajchel-goni-serhat-villalonga@outlook.com>', // sender address
                to: receivers,
                subject: subject,
                text: text,
            });
        } catch (err) {
            console.log(`~`.repeat(32), `\n[mail service] cannot send mail (may the account was blocked by Outlook)\n`, `~`.repeat(32));
        }
    }
}

export default new MailService();
