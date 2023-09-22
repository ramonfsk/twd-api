import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterAndSendEmailController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { SendEmail } from '@/usecases/send-email'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { EmailService, EmailOptions } from '@/usecases/send-email/ports'

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

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
  const mailServiceMock = new MailServiceStub()
  const sendEmailUseCase = new SendEmail(mailOptions, mailServiceMock)
  const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
  const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform (request: any): Promise<void> {
      throw Error()
    }
  }
  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'anyName',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid name', async () => {
    const request: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid email', async () => {
    const request: HttpRequest = {
      body: {
        name: 'anyName',
        email: '@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const request: HttpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name')
  })

  test('should return status code 400 when request is missing email', async () => {
    const request: HttpRequest = {
      body: {
        name: 'anyName'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email')
  })

  test('should return status code 400 when request is missing name and email', async () => {
    const request: HttpRequest = {
      body: {}
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'anyName',
        email: '@mail.com'
      }
    }
    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
