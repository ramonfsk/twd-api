import { NodemailerEmailService } from '@/external/mail-services'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions } from '@/usecases/send-email/ports/email-service'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'test@mail.com'
const toName = 'Anyname'
const toEmail = 'any@mail.com'
const subject = 'test email'
const emailBody = 'hello world!'
const emailBodyHtml = '<b>Hello world!</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: `${fromName} ${fromEmail}`,
  to: `${toName} <${toEmail}>`,
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

jest.mock('nodemailer')
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValueOnce({ sendMail: sendMailMock })

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('should return ok if email is sent', async () => {
    const nodemailer = new NodemailerEmailService()
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toEqual(mailOptions)
  })
  test('should return error if email isnt sent', async () => {
    const nodemailer = new NodemailerEmailService()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
