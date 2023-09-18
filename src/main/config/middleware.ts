import { Express } from 'express'
import { bodyParser } from '@/main/config/middlewares/body-parser'
import { cors } from '@/main/config/middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
