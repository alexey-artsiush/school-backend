import nodemailer from 'nodemailer'
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: 'school.info.noreplay@gmail.com',
                pass: 'bkcx uadu wepo kdub',
            },
        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Activation account` + process.env.API_URL,
            text: '',
            html: `
             <div>
                    <h1>For successful activation follow the link: </h1>
                    <a href="${link}">${link}</a>
                </div>
                `,
        })
    }
}

export default new MailService()
