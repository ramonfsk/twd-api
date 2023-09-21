import { UserData } from '@/entities'
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

describe('Mongodb User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()
    const user: UserData = {
      name: 'Any',
      email: 'any@mail.com'
    }
    await userRepository.add(user)
    expect(await userRepository.exists(user)).toBeTruthy()
  })

  test('find all users should return all added users', async () => {
    const userRepository = new MongodbUserRepository()
    await userRepository.add({
      name: 'First Name',
      email: 'anyf@mail.com'
    })
    await userRepository.add({
      name: 'Second Name',
      email: 'anys@mail.com'
    })
    const users = await userRepository.findAllUsers()
    expect(users[0].name).toEqual('First Name')
    expect(users[1].name).toEqual('Second Name')
  })
})
