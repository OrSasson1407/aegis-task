import { Router } from 'express';
import { getRadarScan, getThreatBoard, getAlerts } from '../controllers/radar.controller.js';

const router = Router();

// GET /api/radar/scan      — full radar sweep with all targets + physics
router.get('/scan', getRadarScan);

// GET /api/radar/threats   — only CRITICAL + HIGH targets sorted by ETA
router.get('/threats', getThreatBoard);

// GET /api/radar/alerts    — notification alert log
router.get('/alerts', getAlerts);

export default router;
