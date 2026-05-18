import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/bookings.routes';
import eventRoutes from './routes/events.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedClientOrigins = new Set([
  process.env.CLIENT_URL || 'http://localhost:4200',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
]);

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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    message: error.message || 'Internal server error'
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
