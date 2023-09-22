import { User, type UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'anyName'
    const email = 'any@mail.com'
    const user = User.create({ name, email }).value as User
    const response = await useCase.perform(user)
    const addedUser = repo.findUserByEmail('any@mail.com')
    expect((await addedUser).name).toBe('anyName')
    expect(response.name).toBe('anyName')
  })
})
