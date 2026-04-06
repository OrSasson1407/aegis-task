import type { Request, Response, NextFunction } from 'express';
import { Target, TargetStatus } from '../models/Target.js';
import { TrajectoryService } from '../services/trajectory.service.js';
import { AegisError } from '../middleware/error.middleware.js';
import { db } from '../data/database.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const enrichTarget = (t: InstanceType<typeof Target> | (typeof db.targets)[0]) => ({
  ...t,
  ...TrajectoryService.getSnapshot(t),
});

const findTarget = (id: string) => db.targets.find(t => t.id === id);

// ─── GET /api/targets ─────────────────────────────────────────────────────────
export const getAllTargets = (req: Request, res: Response) => {
  const { status, category, severity, tag } = req.query;

  let targets = db.targets;

  if (status)   targets = targets.filter(t => t.status === status);
  if (category) targets = targets.filter(t => t.category === category);
  if (severity) targets = targets.filter(t => t.severity === Number(severity));
  if (tag)      targets = targets.filter(t => t.tags.includes(tag as string));

  res.json({
    count: targets.length,
    targets: targets.map(enrichTarget),
  });
};

// ─── GET /api/targets/:id ─────────────────────────────────────────────────────
export const getTargetById = (req: Request, res: Response, next: NextFunction) => {
  const target = findTarget(req.params.id);
  if (!target) return next(new AegisError(404, `Target "${req.params.id}" not found on radar.`, 'TARGET_NOT_FOUND'));

  res.json(enrichTarget(target));
};

// ─── POST /api/targets ────────────────────────────────────────────────────────
export const createTarget = (req: Request, res: Response) => {
  const newTarget = new Target({
    ...req.body,
    id: db.generateId('tgt'),
  });

  db.targets.push(newTarget);

  res.status(201).json({
    message: `Target "${newTarget.title}" acquired on radar.`,
    target: enrichTarget(newTarget),
  });
};

// ─── PUT /api/targets/:id ─────────────────────────────────────────────────────
export const updateTarget = (req: Request, res: Response, next: NextFunction) => {
  const target = findTarget(req.params.id);
  if (!target) return next(new AegisError(404, `Target "${req.params.id}" not found.`, 'TARGET_NOT_FOUND'));

  Object.assign(target, req.body);

  res.json({
    message: `Target "${target.title}" updated.`,
    target: enrichTarget(target),
  });
};

// ─── PATCH /api/targets/:id/status ───────────────────────────────────────────
export const updateTargetStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body as { status: TargetStatus };
  const target = findTarget(req.params.id);

  if (!target) return next(new AegisError(404, 'Target not found.', 'TARGET_NOT_FOUND'));
  if (!Object.values(TargetStatus).includes(status)) {
    return next(new AegisError(400, `Invalid status: ${status}`, 'INVALID_STATUS'));
  }

  target.status = status;

  res.json({
    message: `Target "${target.title}" status updated to ${status}.`,
    target: enrichTarget(target),
  });
};

// ─── DELETE /api/targets/:id ──────────────────────────────────────────────────
export const deleteTarget = (req: Request, res: Response, next: NextFunction) => {
  const index = db.targets.findIndex(t => t.id === req.params.id);
  if (index === -1) return next(new AegisError(404, 'Target not found.', 'TARGET_NOT_FOUND'));

  const [removed] = db.targets.splice(index, 1);

  res.json({
    message: `Target "${removed.title}" removed from radar.`,
    id: removed.id,
  });
};
