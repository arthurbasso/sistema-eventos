import express from 'express'
import fs from 'fs'
import type {Request, Response} from 'express'
import morgan from 'morgan'

import userRoutes from './routes/users.routes'

const app = express()

app.use(express.json())
app.use(morgan('combined', { stream: fs.createWriteStream('access.log', { flags: 'a' }) }))

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('ok')
})

app.use(['/user', '/users'], userRoutes)

app.listen(process.env.USER_API_PORT, () => {
  console.log(`User API listening on port ${process.env.USER_API_PORT}`)
})


