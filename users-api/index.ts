import express from 'express'
import fs from 'fs'
import type { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import userRoutes from './routes/users.routes'
import sessionRoutes from './routes/session.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('combined', { stream: fs.createWriteStream('access.log', { flags: 'a' }) }))

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('ok')
})

app.use(['/user', '/users'], userRoutes)
app.use(['/session', '/sessions'], sessionRoutes)

app.listen(3001, () => {
  console.log(`User API listening on port 3001`)
})


