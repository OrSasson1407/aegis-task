export enum InterceptorType {
  DEEP_WORK  = 'DEEP_WORK',   // Long focused session
  QUICK_FIX  = 'QUICK_FIX',  // < 30 min task
  MEETING    = 'MEETING',     // Collaboration block
  REVIEW     = 'REVIEW',      // Code / document review
  RESEARCH   = 'RESEARCH',    // Investigation sprint
}

export enum InterceptorStatus {
  PLANNED   = 'PLANNED',    // Scheduled, not started
  ACTIVE    = 'ACTIVE',     // Currently in progress
  COMPLETED = 'COMPLETED',  // Done — target may be neutralized
  ABORTED   = 'ABORTED',    // Cancelled mid-flight
}

export interface IInterceptor {
  id: string;
  targetId: string;           // Target this interceptor is assigned to
  type: InterceptorType;
  status: InterceptorStatus;
  label?: string;             // Human-readable block title
  notes?: string;             // Optional context

  // Mission Timing
  startTime: number;          // Unix ms — when work block begins
  duration: number;           // Minutes
  isConfirmed: boolean;
}

export class Interceptor implements IInterceptor {
  id: string;
  targetId: string;
  type: InterceptorType;
  status: InterceptorStatus;
  label?: string;
  notes?: string;
  startTime: number;
  duration: number;
  isConfirmed: boolean = false;

  constructor(data: Omit<IInterceptor, 'id' | 'status' | 'isConfirmed'> & Partial<Pick<IInterceptor, 'id' | 'status' | 'isConfirmed'>>) {
    this.id = data.id || `int-${Date.now().toString(36)}`;
    this.targetId = data.targetId;
    this.type = data.type;
    this.status = data.status || InterceptorStatus.PLANNED;
    this.label = data.label;
    this.notes = data.notes;
    this.startTime = data.startTime;
    this.duration = data.duration;
    this.isConfirmed = data.isConfirmed ?? false;
  }
}
