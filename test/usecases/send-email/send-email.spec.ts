import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { SendEmail } from '@/usecases/send-email'
import { User } from '@/entities'

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

class MailServiceStub implements EmailService {
  async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(mailOptions)
  }
}

class MailServiceErrorStub implements EmailService {
  async send (_: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  const mailServiceStub = new MailServiceStub()
  const useCase = new SendEmail(mailOptions, mailServiceStub)

  test('should email user with valid name and email address', async () => {
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = (await useCase.perform(user)).value as EmailOptions
    expect(response.to).toEqual(`${toName} <${toEmail}>`)
  })

  test('should return error when email service fails', async () => {
    const mailServiceStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = (await useCase.perform(user)).value as unknown as User
    expect(response).toBeInstanceOf(MailServiceError)
  })
})
