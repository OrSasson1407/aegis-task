import { Router } from 'express';
import {
  getAllInterceptors,
  getInterceptorById,
  launchInterceptor,
  updateInterceptor,
  confirmInterceptor,
  deleteInterceptor,
} from '../controllers/interceptor.controller.js';
import { validate, CreateInterceptorSchema, UpdateInterceptorSchema } from '../middleware/validation.middleware.js';
import { apiKeyGuard } from '../middleware/auth.middleware.js';

const router = Router();

// GET    /api/interceptors              — list all (supports ?targetId, ?status, ?type)
router.get('/', getAllInterceptors);

// GET    /api/interceptors/:id         — single interceptor
router.get('/:id', getInterceptorById);

// POST   /api/interceptors             — launch interceptor
router.post('/', apiKeyGuard, validate(CreateInterceptorSchema), launchInterceptor);

// PUT    /api/interceptors/:id         — update interceptor
router.put('/:id', apiKeyGuard, validate(UpdateInterceptorSchema), updateInterceptor);

// PATCH  /api/interceptors/:id/confirm — confirm the time block
router.patch('/:id/confirm', apiKeyGuard, confirmInterceptor);

// DELETE /api/interceptors/:id         — recall interceptor
router.delete('/:id', apiKeyGuard, deleteInterceptor);

export default router;
