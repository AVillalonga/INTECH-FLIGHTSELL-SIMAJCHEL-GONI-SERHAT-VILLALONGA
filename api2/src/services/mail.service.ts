import nodemailer from "nodemailer";

class MailService {
    async sendMail(receivers: string, subject: string, text: string) {
        try {
            const transporter = nodemailer.createTransport({
                host: "in-v3.mailjet.com",
                port: 587,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "ad2d0596f3fbcf7bee02cba5d76533c9", // generated ethereal user
                    pass: "b9864f4843ea479ffd1b8948e5827abc", // generated ethereal password
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
