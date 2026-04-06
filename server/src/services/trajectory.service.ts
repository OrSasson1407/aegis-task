import { type ITarget, TargetStatus } from '../models/Target.js';
export class TrajectoryService {
  /**
   * Calculates the current "Radial Distance" (0 to 100).
   * 100 = Just appeared on the edge of the radar.
   * 0 = IMPACT (The deadline has hit the center).
   */
  static calculateDistance(target: ITarget): number {
    const now = Date.now();
    const totalDuration = target.impactTimestamp - target.launchTimestamp;
    const timeRemaining = target.impactTimestamp - now;

    // If the deadline has passed, distance is 0
    if (timeRemaining <= 0) return 0;

    // Calculate percentage of journey remaining
    const distance = (timeRemaining / totalDuration) * 100;
    
    return Math.min(Math.max(distance, 0), 100);
  }

  /**
   * Checks if a target has "Impacted" the center.
   */
  static checkImpactStatus(target: ITarget): TargetStatus {
    const distance = this.calculateDistance(target);
    if (distance <= 0 && target.status === TargetStatus.TRACKING) {
      return TargetStatus.IMPACTED;
    }
    return target.status;
  }
}