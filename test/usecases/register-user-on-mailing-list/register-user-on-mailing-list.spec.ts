import type { UserData } from '@/entities/user-data'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { InMemoryUserRepository } from '../../../src/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { RegisterUserOnMailingList } from '../../../src/usecases/register-user-on-mailing-list/repository/register-user-on-mailing-list'
import { left } from '../../../src/shared/either'
import { InvalidEmailError } from '../../../src/entities/errors/invalid-email-error'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'anyName'
    const email = 'any@mail.com'
    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail('any@mail.com')
    expect((await user).name).toBe('anyName')
    expect(response.value.name).toBe('anyName')
  })

  test('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'anyName'
    const email = 'invalidMail'
    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail('any@mail.com')
    expect(await user).toBeNull()
    expect(response).toEqual(left(new InvalidEmailError()))
  })
})
