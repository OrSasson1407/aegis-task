import type { Request, Response, NextFunction } from 'express';
import { Interceptor, InterceptorStatus } from '../models/Interceptor.js';
import { TargetStatus } from '../models/Target.js';
import { AegisError } from '../middleware/error.middleware.js';
import { db } from '../data/database.js';

// ─── GET /api/interceptors ────────────────────────────────────────────────────
export const getAllInterceptors = (req: Request, res: Response) => {
  const { targetId, status, type } = req.query;

  let interceptors = db.interceptors;
  if (targetId) interceptors = interceptors.filter(i => i.targetId === targetId);
  if (status)   interceptors = interceptors.filter(i => i.status === status);
  if (type)     interceptors = interceptors.filter(i => i.type === type);

  res.json({ count: interceptors.length, interceptors });
};

// ─── GET /api/interceptors/:id ────────────────────────────────────────────────
export const getInterceptorById = (req: Request, res: Response, next: NextFunction) => {
  const interceptor = db.interceptors.find(i => i.id === req.params.id);
  if (!interceptor) return next(new AegisError(404, 'Interceptor not found.', 'INTERCEPTOR_NOT_FOUND'));
  res.json(interceptor);
};

// ─── POST /api/interceptors ───────────────────────────────────────────────────
export const launchInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const target = db.targets.find(t => t.id === req.body.targetId);
  if (!target) {
    return next(new AegisError(404, `Target "${req.body.targetId}" not found. Cannot launch interceptor.`, 'TARGET_NOT_FOUND'));
  }

  const interceptor = new Interceptor({
    ...req.body,
    id: db.generateId('int'),
  });

  db.interceptors.push(interceptor);

  // Mark target as intercepted
  target.status = TargetStatus.INTERCEPTED;

  res.status(201).json({
    message: `Interceptor launched for target "${target.title}".`,
    interceptor,
    target,
  });
};

// ─── PUT /api/interceptors/:id ────────────────────────────────────────────────
export const updateInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const interceptor = db.interceptors.find(i => i.id === req.params.id);
  if (!interceptor) return next(new AegisError(404, 'Interceptor not found.', 'INTERCEPTOR_NOT_FOUND'));

  Object.assign(interceptor, req.body);

  // If interceptor is COMPLETED → neutralize the target
  if (req.body.status === InterceptorStatus.COMPLETED) {
    const target = db.targets.find(t => t.id === interceptor.targetId);
    if (target) target.status = TargetStatus.NEUTRALIZED;
  }

  res.json({ message: 'Interceptor updated.', interceptor });
};

// ─── PATCH /api/interceptors/:id/confirm ─────────────────────────────────────
export const confirmInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const interceptor = db.interceptors.find(i => i.id === req.params.id);
  if (!interceptor) return next(new AegisError(404, 'Interceptor not found.', 'INTERCEPTOR_NOT_FOUND'));

  interceptor.isConfirmed = true;
  interceptor.status = InterceptorStatus.PLANNED;

  res.json({ message: `Interceptor ${interceptor.id} confirmed.`, interceptor });
};

// ─── DELETE /api/interceptors/:id ─────────────────────────────────────────────
export const deleteInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const index = db.interceptors.findIndex(i => i.id === req.params.id);
  if (index === -1) return next(new AegisError(404, 'Interceptor not found.', 'INTERCEPTOR_NOT_FOUND'));

  // Revert target back to TRACKING if interceptor is removed
  const [removed] = db.interceptors.splice(index, 1);
  const target = db.targets.find(t => t.id === removed.targetId);
  if (target && target.status === TargetStatus.INTERCEPTED) {
    target.status = TargetStatus.TRACKING;
  }

  res.json({ message: `Interceptor "${removed.id}" recalled.`, id: removed.id });
};
