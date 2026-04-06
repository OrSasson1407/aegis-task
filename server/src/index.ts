import express from 'express';
import cors from 'cors';
import radarRoutes from './routes/radar.routes.js';
import { radarLogger } from './middleware/logger.middleware.js';
import { systemShield } from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. System Shields & Middleware ---
app.use(cors());
app.use(express.json());
app.use(radarLogger); // Logs every incoming radar scan to the terminal

// --- 2. Tactical Routes ---
app.use('/api/radar', radarRoutes);

// --- 3. Diagnostics (Health Check) ---
app.get('/status', (req, res) => {
  res.json({ 
    status: 'Aegis Core is operational',
    timestamp: Date.now()
  });
});

// --- 4. Critical Fault Handler ---
// Express requires error middleware to be at the very bottom
app.use(systemShield);

// --- 5. System Ignition ---
app.listen(PORT, () => {
  console.log(`
  ========================================
  AEGIS-TASK COMMAND CENTER
  Radar Server: http://localhost:${PORT}
  Status: OPERATIONAL
  ========================================
  `);
});