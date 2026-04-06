export enum InterceptorType {
  DEEP_WORK = 'DEEP_WORK',
  QUICK_FIX = 'QUICK_FIX',
  MEETING = 'MEETING'
}

export interface IInterceptor {
  id: string;
  targetId: string;       // The specific Target this is launched to meet
  type: InterceptorType;
  
  // Mission Timing
  startTime: number;      // When you will start working
  duration: number;       // Duration in minutes
  
  isConfirmed: boolean;   // Has the user committed to this block?
}

export class Interceptor implements IInterceptor {
  id: string;
  targetId: string;
  type: InterceptorType;
  startTime: number;
  duration: number;
  isConfirmed: boolean = false;

  constructor(data: Omit<IInterceptor, 'isConfirmed'>) {
    this.id = data.id || `INT-${Math.random().toString(36).substring(7)}`;
    this.targetId = data.targetId;
    this.type = data.type;
    this.startTime = data.startTime;
    this.duration = data.duration;
  }
}