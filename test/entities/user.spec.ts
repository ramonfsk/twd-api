import { User } from '../../src/entities'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const email = 'invalidEmail'
    const error = User.create({ name: 'anyname', email }).value as Error
    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual('Invalid email: ' + email)
  })

  test('should not create user with invalid name (too few characters)', () => {
    const name = 'O      '
    const error = User.create({ name, email: 'any@mail.com' }).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual('Invalid name: ' + name)
  })

  test('should not create user with invalid name (too many characters)', () => {
    const name = 'O'.repeat(257)
    const error = User.create({ name, email: 'any@mail.com' }).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual('Invalid name: ' + name)
  })

  test('should create user with valid data', () => {
    const name = 'anyName'
    const email = 'any@mail.com'
    const user: User = User.create({ name, email }).value as User
    expect(user.name.value).toEqual(name)
    expect(user.email.value).toEqual(email)
  })
})
