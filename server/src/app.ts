import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/bookings.routes';
import eventRoutes from './routes/events.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const getAllowedClientOrigins = (): Set<string> => {
  return new Set(
    [
      process.env.CLIENT_URL,
      process.env.URL,
      process.env.DEPLOY_PRIME_URL,
      'http://localhost:4200',
      'http://127.0.0.1:4200'
    ].filter((origin): origin is string => Boolean(origin))
  );
};

export const createApp = (basePaths: string[] = ['/api']): express.Express => {
  const app = express();
  const allowedClientOrigins = getAllowedClientOrigins();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedClientOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true
    })
  );
  app.use(express.json());

  for (const basePath of basePaths) {
    app.get(`${basePath}/health`, (_req, res) => {
      res.json({ status: 'ok' });
    });

    app.use(`${basePath}/auth`, authRoutes);
    app.use(`${basePath}/events`, eventRoutes);
    app.use(`${basePath}/bookings`, bookingRoutes);
    app.use(`${basePath}/users`, userRoutes);
  }

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  });

  return app;
};
