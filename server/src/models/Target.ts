export enum TargetStatus {
  TRACKING    = 'TRACKING',     // Active — moving toward center
  INTERCEPTED = 'INTERCEPTED',  // Interceptor launched
  IMPACTED    = 'IMPACTED',     // Deadline passed — mission failed
  NEUTRALIZED = 'NEUTRALIZED',  // Completed successfully
}

export enum TargetCategory {
  ENGINEERING = 'Engineering',
  OPERATIONS  = 'Operations',
  SECURITY    = 'Security',
  HR          = 'HR',
  SALES       = 'Sales',
  FINANCE     = 'Finance',
  OTHER       = 'Other',
}

export interface ITarget {
  id: string;
  title: string;
  description?: string;
  status: TargetStatus;
  category?: string;

  // Tactical Positioning
  severity: number;   // 1–5 (controls visual size + threat color)
  sector: number;     // 0–359 (angle on the radar ring)

  // Time/Physics Data
  launchTimestamp: number;  // When task was created
  impactTimestamp: number;  // THE DEADLINE — when it hits (0,0)

  // Metadata
  tags: string[];
}

export class Target implements ITarget {
  id: string;
  title: string;
  description?: string;
  status: TargetStatus = TargetStatus.TRACKING;
  category?: string;
  severity: number;
  sector: number;
  launchTimestamp: number;
  impactTimestamp: number;
  tags: string[] = [];

  constructor(data: Partial<ITarget> & { title: string; impactTimestamp: number }) {
    this.id = data.id || `tgt-${Date.now().toString(36)}`;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || TargetStatus.TRACKING;
    this.category = data.category || TargetCategory.OTHER;
    this.severity = data.severity ?? 1;
    this.sector = data.sector ?? Math.floor(Math.random() * 360);
    this.launchTimestamp = data.launchTimestamp ?? Date.now();
    this.impactTimestamp = data.impactTimestamp;
    this.tags = data.tags || [];
  }
}
