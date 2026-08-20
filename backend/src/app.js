import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { env } from './config/env.js';

export const app = express();

app.use(cors({ origin: env.clientUrl.split(',').map((s) => s.trim()), credentials: true }));
app.use(express.json({ limit: '1mb' }));
if (!env.isProd) app.use(morgan('dev'));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
