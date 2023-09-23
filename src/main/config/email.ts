import { EmailOptions } from '@/usecases/send-email/ports'

const attachments = [{
  filename: 'text.txt',
  path: '../../../resources/text.txt'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Ramon Ferreira | ramonfsk <ramonfsk@mgail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from,
    to,
    subject: 'Mensagem de teste',
    text: 'Texto da mensagem',
    html: '<b>Texto da mensagem</b>',
    attachments
  }
  return mailOptions
}
