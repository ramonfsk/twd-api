import { InvalidNameError } from '../../src/entities/errors/invalid-name-errors'
import { InvalidEmailError } from '../../src/entities/errors/invalid-email-error'
import { User } from '../../src/entities/user'
import { left } from '../../src/shared/either'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalidEmail'
    const error = User.create({ name: 'anyname', email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })

  test('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'O      '
    const error = User.create({ name: invalidName, email: 'any@mail.com' })
    expect(error).toEqual(left(new InvalidNameError()))
  })

  test('should not create user with invalid name (too many characters)', () => {
    const invalidName = 'O'.repeat(257)
    const error = User.create({ name: invalidName, email: 'any@mail.com' })
    expect(error).toEqual(left(new InvalidNameError()))
  })

  test('should create user with valid data', () => {
    const name = 'anyName'
    const email = 'any@mail.com'
    const user: User = User.create({ name, email }).value as User
    expect(user.name.value).toEqual(name)
    expect(user.email.value).toEqual(email)
  })
})
