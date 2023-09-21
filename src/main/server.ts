import 'module-alias/register'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

MongoHelper.connect(process.env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000')
    })
  })
  .catch(console.error)
