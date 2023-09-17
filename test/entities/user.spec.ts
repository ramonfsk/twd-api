import { InvalidEmailError } from '../../src/entities/errors/invalid-email-error'
import { User } from '../../src/entities/user'
import { left } from '../../src/shared/either'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalidEmail'
    const error = User.create({ name: 'anyname', email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })
})
