import { UserData } from '@/usecases/register-user-on-mailing-list/user-data'
import { InMemoryUserRepository } from '../../../../src/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'

describe('In memory User repository', () => {
  test('should return null if user not found', async () => {
    const users: UserData[] = []
    const sut = new InMemoryUserRepository(users)
    const user = await sut.findUserByEmail('any@mail.com')
    expect(user).toBeNull()
  })

  test('should return user if is found in the repository', async () => {
    const users: UserData[] = []
    const name = 'anyname'
    const email = 'any@mail.com'
    const sut = new InMemoryUserRepository(users)
    await sut.add({ name, email })
    const user = await sut.findUserByEmail('any@mail.com')
    expect(user.name).toBe('anyname')
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [
      { name: 'anyname', email: 'any@mail.com' },
      { name: 'secondname', email: 'second@mail.com' }]
    const sut = new InMemoryUserRepository(users)
    const returnedUsers = sut.findAllUsers()
    expect((await (returnedUsers)).length).toBe(2)
  })
})
