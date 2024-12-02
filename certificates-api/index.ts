import express from 'express'
import fs from 'fs'
import type {Request, Response} from 'express'
import morgan from 'morgan'
import cors from 'cors';

import certificateRoutes from './routes/certificates.routes'

const app = express()

app.use(cors());
app.use(express.json())
app.use(morgan('combined', { stream: fs.createWriteStream('access.log', { flags: 'a' }) }))

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('ok')
})

app.use(['/certificate', '/certificates'], certificateRoutes)

app.listen(process.env.CERTIFICATE_API_PORT, () => {
  console.log(`Certificate API listening on port ${process.env.CERTIFICATE_API_PORT}`)
})