import express from 'express';
import fs from 'fs';
import type { Request, Response } from 'express';
import morgan from 'morgan';

import registerRoutes from './routes/registers.routes';
import userRoutes from './routes/users.routes';
import eventRoutes from './routes/events.routes';

const app = express();

app.use(express.json());
app.use(morgan('combined', { stream: fs.createWriteStream('access.log', { flags: 'a' }) }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('ok');
});

app.use(registerRoutes, userRoutes, eventRoutes);

app.listen(process.env.REGISTER_API_PORT, () => {
  console.log(`Register API listening on port ${process.env.REGISTER_API_PORT}`);
});
