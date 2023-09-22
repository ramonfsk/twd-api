import { Either, Left, Right, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { SendEmail } from '@/usecases/send-email'

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

const emailOptions: EmailOptions = {
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
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Send email to user', () => {
  const emailServiceStub = new MailServiceStub()
  const useCase = new SendEmail(emailOptions, emailServiceStub)

  test('should email user with valid name and email address', async () => {
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response).toBeInstanceOf(Right)
  })

  test('should not try to email with invalid email address', async () => {
    const email = '@mail.com'
    const response = await useCase.perform({ name: toName, email })
    expect(response).toBeInstanceOf(Left)
  })
})
