import { Router } from 'express'
import { makeRegisterUserController } from '@/main/factories'
import { adatpRoute } from '@/main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/register', adatpRoute(makeRegisterUserController()))
}
