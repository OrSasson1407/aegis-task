import type { Request, Response } from 'express';
import { TargetStatus } from '../models/Target.js';
import { TrajectoryService } from '../services/trajectory.service.js';
import { notificationService } from '../services/notification.service.js';
import { db } from '../data/database.js';

// ─── GET /api/radar/scan ──────────────────────────────────────────────────────
/**
 * Full radar sweep — returns all targets with live physics snapshots,
 * active alerts, and system telemetry.
 */
export const getRadarScan = (_req: Request, res: Response) => {
  // Auto-update any targets that have passed their deadline
  db.targets.forEach(target => {
    const newStatus = TrajectoryService.checkImpactStatus(target);
    if (newStatus !== target.status) {
      target.status = newStatus;
    }
  });

  const enrichedTargets = db.targets.map(t => ({
    ...t,
    ...TrajectoryService.getSnapshot(t),
  }));

  // Sector summary
  const summary = {
    total:       enrichedTargets.length,
    tracking:    enrichedTargets.filter(t => t.status === TargetStatus.TRACKING).length,
    intercepted: enrichedTargets.filter(t => t.status === TargetStatus.INTERCEPTED).length,
    impacted:    enrichedTargets.filter(t => t.status === TargetStatus.IMPACTED).length,
    neutralized: enrichedTargets.filter(t => t.status === TargetStatus.NEUTRALIZED).length,
    critical:    enrichedTargets.filter(t => t.threatLevel === 'CRITICAL').length,
  };

  res.json({
    timestamp: new Date().toISOString(),
    systemStatus: 'ONLINE',
    summary,
    targets: enrichedTargets,
    alerts: notificationService.getCriticalAlerts().slice(-10),
  });
};

// ─── GET /api/radar/threats ───────────────────────────────────────────────────
/**
 * Returns only CRITICAL and HIGH threat targets, sorted by ETA ascending.
 */
export const getThreatBoard = (_req: Request, res: Response) => {
  const threats = db.targets
    .map(t => ({ ...t, ...TrajectoryService.getSnapshot(t) }))
    .filter(t => t.threatLevel === 'CRITICAL' || t.threatLevel === 'HIGH')
    .sort((a, b) => a.eta - b.eta);

  res.json({ count: threats.length, threats });
};

// ─── GET /api/radar/alerts ───────────────────────────────────────────────────
export const getAlerts = (_req: Request, res: Response) => {
  res.json({
    count: notificationService.getAlerts().length,
    alerts: notificationService.getAlerts(),
  });
};
