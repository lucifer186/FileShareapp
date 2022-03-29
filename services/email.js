const nodemailer = require('nodemailer')
 
async function sendmail(from ,to, subject, text, html){
 let transporter = nodemailer.createTransport({
     host: process.env.Smtp_Host,
     port: process.env.Smtp_Port,
     secure: false,
     auth: {
         user:process.env.mail_user,
         pass: process.env.mail_pass
     }

 })

 let info = await transporter.sendMail({
     from: `Inshare <${from}>` ,
     to: to,
     subject: subject,
     html:html,
     text:text

 })
}

module.exports =  sendmail