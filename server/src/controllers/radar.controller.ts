import type { Request, Response } from 'express';
import { TargetStatus } from '../models/Target.js';
import { TrajectoryService } from '../services/trajectory.service.js';
import { db } from '../data/database.js';

/**
 * Tactical Scan: 
 * Calculates current distance and status for all targets in the system.
 */
export const getRadarScan = (req: Request, res: Response) => {
  const updatedTargets = db.targets.map(t => ({
    ...t,
    distance: TrajectoryService.calculateDistance(t),
    status: TrajectoryService.checkImpactStatus(t)
  }));

  res.json({
    timestamp: Date.now(),
    targets: updatedTargets,
    systemStatus: 'ONLINE'
  });
};

/**
 * Tactical Strike:
 * Deploys an interceptor to neutralize a specific target.
 */
export const launchInterceptor = (req: Request, res: Response) => {
  const { targetId } = req.body;
  const target = db.targets.find(t => t.id === targetId);

  if (!target) {
    return res.status(404).json({ error: 'Target not identified.' });
  }

  // Update status to confirm interception
  target.status = TargetStatus.INTERCEPTED;
  
  res.json({ 
    message: `Interceptor deployed for target: ${target.title}`,
    target 
  });
};