import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import radarRoutes from './routes/radar.routes.js';
import targetRoutes from './routes/target.routes.js';
import interceptorRoutes from './routes/interceptor.routes.js';

import { radarLogger } from './middleware/logger.middleware.js';
import { systemShield } from './middleware/error.middleware.js';
import { notificationService } from './services/notification.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AEGIS_ENV = process.env.NODE_ENV || 'development';

// ─────────────────────────────────────────────
//  1. SYSTEM SHIELDS (Security Middleware)
// ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Aegis-Key'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
//  2. RATE LIMITING (Radar Throttle)
// ─────────────────────────────────────────────
const radarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many radar pings from this IP — throttle engaged.' },
});
app.use('/api/', radarLimiter);

// ─────────────────────────────────────────────
//  3. LOGGING
// ─────────────────────────────────────────────
app.use(radarLogger);

// ─────────────────────────────────────────────
//  4. TACTICAL ROUTES
// ─────────────────────────────────────────────
app.use('/api/radar', radarRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/interceptors', interceptorRoutes);

// ─────────────────────────────────────────────
//  5. SYSTEM DIAGNOSTICS
// ─────────────────────────────────────────────
app.get('/status', (_req, res) => {
  res.json({
    system: 'Aegis-Task Command Center',
    status: 'OPERATIONAL',
    environment: AEGIS_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    version: '2.0.0',
  });
});

app.use((_req, res) => {
  res.status(404).json({
    systemStatus: 'UNKNOWN_SECTOR',
    error: 'Route not found on radar.',
  });
});

// ─────────────────────────────────────────────
//  6. CRITICAL FAULT HANDLER
// ─────────────────────────────────────────────
app.use(systemShield);

// ─────────────────────────────────────────────
//  7. SYSTEM IGNITION
// ─────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║        AEGIS-TASK COMMAND CENTER v2.0        ║
  ║                                              ║
  ║  Radar Server : http://localhost:${PORT}        ║
  ║  Environment  : ${AEGIS_ENV.padEnd(27)}  ║
  ║  Status       : OPERATIONAL ✓                ║
  ╚══════════════════════════════════════════════╝
  `);
  notificationService.startWatchLoop();
});

// ─────────────────────────────────────────────
//  8. GRACEFUL SHUTDOWN
// ─────────────────────────────────────────────
const shutdown = (signal: string) => {
  console.log(`\n[AEGIS] ${signal} received — initiating graceful shutdown...`);
  notificationService.stopWatchLoop();
  server.close(() => {
    console.log('[AEGIS] All connections closed. System offline.\n');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[AEGIS] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('[AEGIS] Uncaught Exception:', err);
  shutdown('uncaughtException');
});
