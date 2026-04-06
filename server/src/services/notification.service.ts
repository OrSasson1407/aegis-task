import { db } from '../data/database.js';
import { TrajectoryService } from './trajectory.service.js';
import { TargetStatus } from '../models/Target.js';

export interface AegisAlert {
  id: string;
  targetId: string;
  targetTitle: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  message: string;
  triggeredAt: number;
}

// In-memory alert log (extend to WebSocket / email later)
const alertLog: AegisAlert[] = [];
let watchInterval: ReturnType<typeof setInterval> | null = null;

export const notificationService = {
  // ─── Alert Log Access ──────────────────────────────────────────────────────
  getAlerts(): AegisAlert[] {
    return alertLog;
  },

  getCriticalAlerts(): AegisAlert[] {
    return alertLog.filter(a => a.level === 'CRITICAL');
  },

  clearAlerts(): void {
    alertLog.length = 0;
  },

  // ─── Watch Loop ───────────────────────────────────────────────────────────
  /**
   * Scans all TRACKING targets every 60 seconds.
   * Emits alerts for CRITICAL and HIGH threat levels.
   */
  startWatchLoop(intervalMs = 60_000): void {
    if (watchInterval) return; // already running

    console.log('[AEGIS] Notification watch loop started.');

    watchInterval = setInterval(() => {
      const activeTargets = db.targets.filter(
        t => t.status === TargetStatus.TRACKING || t.status === TargetStatus.INTERCEPTED
      );

      for (const target of activeTargets) {
        const snapshot = TrajectoryService.getSnapshot(target);

        if (snapshot.threatLevel === 'CRITICAL' || snapshot.threatLevel === 'HIGH') {
          const alert: AegisAlert = {
            id: `alr-${Date.now().toString(36)}`,
            targetId: target.id,
            targetTitle: target.title,
            level: snapshot.threatLevel as 'CRITICAL' | 'HIGH',
            message: `Target "${target.title}" is ${snapshot.etaFormatted} from impact. Threat: ${snapshot.threatLevel}.`,
            triggeredAt: Date.now(),
          };

          alertLog.push(alert);

          console.warn(`[AEGIS ALERT] ${alert.level} — ${alert.message}`);
        }
      }

      // Cap alert log at 100 entries
      if (alertLog.length > 100) alertLog.splice(0, alertLog.length - 100);
    }, intervalMs);
  },

  stopWatchLoop(): void {
    if (watchInterval) {
      clearInterval(watchInterval);
      watchInterval = null;
      console.log('[AEGIS] Notification watch loop stopped.');
    }
  },
};
