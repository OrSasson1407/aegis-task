import { Router } from 'express';
import { getRadarScan, launchInterceptor } from '../controllers/radar.controller.js';

const router = Router();

// Endpoint: GET /api/radar/scan
router.get('/scan', getRadarScan);

// Endpoint: POST /api/radar/intercept
router.post('/intercept', launchInterceptor);

export default router;