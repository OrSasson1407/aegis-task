import { Router } from 'express';
import {
  getAllTargets,
  getTargetById,
  createTarget,
  updateTarget,
  updateTargetStatus,
  deleteTarget,
} from '../controllers/target.controller.js';
import { validate, CreateTargetSchema, UpdateTargetSchema } from '../middleware/validation.middleware.js';
import { apiKeyGuard } from '../middleware/auth.middleware.js';

const router = Router();

// GET    /api/targets              — list all (supports ?status, ?category, ?severity, ?tag)
router.get('/', getAllTargets);

// GET    /api/targets/:id          — single target with live physics
router.get('/:id', getTargetById);

// POST   /api/targets              — create new target (requires API key in prod)
router.post('/', apiKeyGuard, validate(CreateTargetSchema), createTarget);

// PUT    /api/targets/:id          — full update
router.put('/:id', apiKeyGuard, validate(UpdateTargetSchema), updateTarget);

// PATCH  /api/targets/:id/status   — status-only update
router.patch('/:id/status', apiKeyGuard, updateTargetStatus);

// DELETE /api/targets/:id          — remove target
router.delete('/:id', apiKeyGuard, deleteTarget);

export default router;
