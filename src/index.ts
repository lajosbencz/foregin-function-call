
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

import express, {Express} from 'express'
import cors from 'cors'

import r_healthz from './routes/healthz.js'
import r_call from './routes/call.js'

const hostname: string = process.env.HOST || '0.0.0.0'
const port: number = parseInt(`${process.env.PORT}`) || 3000

const app: Express = express()
app.use(cors())
app.use(express.json())

app.all('/', r_healthz)
app.get('/healthz', r_healthz)
app.post('/call', r_call)

app.listen(port, hostname, () => {
  const addr = hostname === '0.0.0.0' ? 'localhost' : hostname
  console.log(`Server running at http://${addr}:${port}/`)
})
