import request from 'supertest'
import app from '@/main/config/app'

describe('Register route', () => {
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
      .expect(201)
  })
})