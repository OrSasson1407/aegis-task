export enum TargetStatus {
  TRACKING = 'TRACKING',      // Moving toward the center (Active)
  INTERCEPTED = 'INTERCEPTED', // Interceptor (Time-block) has been launched
  IMPACTED = 'IMPACTED',       // Deadline passed without completion
  NEUTRALIZED = 'NEUTRALIZED'  // Task completed successfully
}

export interface ITarget {
  id: string;
  title: string;
  description?: string;
  status: TargetStatus;
  
  // Tactical Data
  severity: number;      // 1-5 (Affects visual size/color)
  sector: number;        // 0-359 (Where on the circular radar it sits)
  
  // Physics/Time Data
  launchTimestamp: number; // When the task was created
  impactTimestamp: number; // THE DEADLINE (When it hits 0,0)
  
  // Metadata
  tags: string[];
}

/**
 * A Target class can include methods to calculate 
 * real-time distance from the center.
 */
export class Target implements ITarget {
  id: string;
  title: string;
  status: TargetStatus = TargetStatus.TRACKING;
  severity: number;
  sector: number;
  launchTimestamp: number;
  impactTimestamp: number;
  tags: string[] = [];

  constructor(data: Partial<ITarget> & { title: string; impactTimestamp: number }) {
    this.id = data.id || Math.random().toString(36).substring(7);
    this.title = data.title;
    this.severity = data.severity || 1;
    this.sector = data.sector || Math.floor(Math.random() * 360);
    this.launchTimestamp = data.launchTimestamp || Date.now();
    this.impactTimestamp = data.impactTimestamp;
  }
}