import type { UserData } from '@/entities/user-data'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    console.log(users)
    // const repo: UserRepository = new InMemoryUserRepository(users)
    // const userCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    // const name = 'anyname'
    // const email = 'any@email.com'
    // const response = await userCase.registerUserOnMailingList({ name, email })
    // const user = repo.findUserByEmail('any@email.com')
    // expect((await user).name).toBe('anyname')
  })
})
