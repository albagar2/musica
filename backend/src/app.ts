// =============================================================================
// Backend Express Application Setup
// =============================================================================

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './shared/errors/errorHandler';
import { asyncHandler } from './shared/utils/asyncHandler';
import path from 'path';
import authRouter from './routes/auth';
import tracksRouter from './routes/tracks';
import playlistsRouter from './routes/playlists';

export function createApp(): Application {
  const app = express();

  // Static files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use('/music', express.static(path.join(process.cwd(), '../music')));

  // Security middlewares
  app.use(helmet());
  app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));

  // Rate limiting (100 requests per 15 minutes per IP)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Demasiadas solicitudes, por favor intente más tarde.',
  });
  app.use(limiter);

  // Body parsing & logger
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(requestLogger);

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/tracks', tracksRouter);
  app.use('/api/playlists', playlistsRouter);

  // Global error handler (must be after routes)
  app.use(errorHandler);

  // 404 fallback
  app.use('*', asyncHandler(async (_req, res) => {
    res.status(404).json({ success: false, message: 'Recurso no encontrado' });
  }));

  return app;
}
