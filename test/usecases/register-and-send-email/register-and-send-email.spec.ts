import { User } from '@/entities'
import { UserData } from '@/entities/user-data'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories'
import { SendEmail } from '@/usecases/send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

describe('Register and send email to user', () => {
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

  class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0
    async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled++
      return right(mailOptions)
    }
  }

  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const name = 'anyName'
    const email = 'any@mail.com'
    const response: User = (await registerAndSendEmailUseCase.perform({ name, email })).value as User
    const user = repo.findUserByEmail('any@mail.com')
    expect((await user).name).toBe('anyName')
    expect(response.name.value).toBe('anyName')
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
    expect(response.name.value).toEqual('anyName')
  })
})
