import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MongoHelper } from './helper'

export class MongodbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userColletion = MongoHelper.getCollection('users')
    const exists = await this.exists(user)
    if (!exists) {
      await userColletion.insertOne({
        name: user.name,
        email: user.email
      } as UserData)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userColletion = MongoHelper.getCollection('users')
    const result = await userColletion.findOne<UserData>({ email })
    if (!result) {
      return null
    }

    return result
  }

  findAllUsers (): Promise<UserData[]> {
    throw new Error('Method not implemented.')
  }

  async exists (user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email)
    if (result != null) {
      return true
    }

    return false
  }
}
