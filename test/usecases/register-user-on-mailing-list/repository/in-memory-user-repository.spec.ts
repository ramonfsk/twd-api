import { UserData } from '@/usecases/register-user-on-mailing-list/user-data'
import { InMemoryUserRepository } from '../../../../src/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'

describe('In memory User repository', () => {
  test('should return null if user not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if is found in the repository', async () => {
    const users: UserData[] = []
    const name = 'anyname'
    const email = 'any@email.com'
    const userRepo = new InMemoryUserRepository(users)
    await userRepo.add({ name, email })
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user.name).toBe('anyname')
  })
})