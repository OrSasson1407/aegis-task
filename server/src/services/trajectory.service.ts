import { type ITarget, TargetStatus } from '../models/Target.js';

export interface TrajectorySnapshot {
  distance: number;       // 0–100 (100 = just appeared, 0 = impacted)
  velocity: number;       // Units/hour approaching center
  eta: number;            // MS until impact
  etaFormatted: string;   // Human-readable (e.g. "2h 14m")
  threatLevel: ThreatLevel;
  status: TargetStatus;
}

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export class TrajectoryService {
  // ─── Core Distance Calculation ─────────────────────────────────────────────
  /**
   * Distance from center: 100 (just created) → 0 (deadline hit).
   * Clamped to [0, 100].
   */
  static calculateDistance(target: ITarget): number {
    const now = Date.now();
    const totalDuration = target.impactTimestamp - target.launchTimestamp;
    const timeRemaining = target.impactTimestamp - now;

    if (totalDuration <= 0) return 0;
    if (timeRemaining <= 0) return 0;

    const distance = (timeRemaining / totalDuration) * 100;
    return Math.min(Math.max(distance, 0), 100);
  }

  // ─── Velocity ─────────────────────────────────────────────────────────────
  /**
   * How many radar units per hour the target is moving toward center.
   * Higher severity = amplified apparent velocity on the display.
   */
  static calculateVelocity(target: ITarget): number {
    const totalDuration = target.impactTimestamp - target.launchTimestamp;
    if (totalDuration <= 0) return 0;

    // Base velocity: distance units per hour
    const hoursTotal = totalDuration / (1000 * 60 * 60);
    const baseVelocity = 100 / hoursTotal;

    // Severity multiplier (1–5 → 1.0×–2.0×)
    const severityMultiplier = 1 + (target.severity - 1) * 0.25;
    return Math.round(baseVelocity * severityMultiplier * 100) / 100;
  }

  // ─── ETA ──────────────────────────────────────────────────────────────────
  static calculateETA(target: ITarget): number {
    return Math.max(target.impactTimestamp - Date.now(), 0);
  }

  static formatETA(ms: number): string {
    if (ms <= 0) return 'IMPACTED';
    const totalSeconds = Math.floor(ms / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0)    return `${days}d ${hours}h`;
    if (hours > 0)   return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  // ─── Threat Level ─────────────────────────────────────────────────────────
  /**
   * Combines distance + severity into a 5-tier threat level.
   */
  static calculateThreatLevel(target: ITarget): ThreatLevel {
    const distance = this.calculateDistance(target);

    if (distance <= 0)   return 'SAFE';     // Already impacted / neutralized
    if (target.status === TargetStatus.NEUTRALIZED) return 'SAFE';

    // Weighted score: lower distance and higher severity = more critical
    const score = (100 - distance) * (target.severity / 5);

    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 35) return 'MEDIUM';
    if (score >= 10) return 'LOW';
    return 'SAFE';
  }

  // ─── Impact Status Check ──────────────────────────────────────────────────
  static checkImpactStatus(target: ITarget): TargetStatus {
    if (
      target.status === TargetStatus.NEUTRALIZED ||
      target.status === TargetStatus.IMPACTED
    ) {
      return target.status;
    }

    const distance = this.calculateDistance(target);
    if (distance <= 0 && target.status === TargetStatus.TRACKING) {
      return TargetStatus.IMPACTED;
    }
    return target.status;
  }

  // ─── Full Snapshot ────────────────────────────────────────────────────────
  /**
   * Returns a complete physics snapshot for a target — used by the radar scan.
   */
  static getSnapshot(target: ITarget): TrajectorySnapshot {
    const eta = this.calculateETA(target);
    return {
      distance:     this.calculateDistance(target),
      velocity:     this.calculateVelocity(target),
      eta,
      etaFormatted: this.formatETA(eta),
      threatLevel:  this.calculateThreatLevel(target),
      status:       this.checkImpactStatus(target),
    };
  }
}
