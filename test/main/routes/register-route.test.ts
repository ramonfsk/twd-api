import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

describe('Register route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('should return an account on success', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Any',
        email: 'any@mail.com'
      })
      .expect(200)
  }, 20000)
})
