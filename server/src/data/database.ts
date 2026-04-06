import { type ITarget, TargetStatus } from '../models/Target.js';
import { type IInterceptor, InterceptorType } from '../models/Interceptor.js';

const now = Date.now();
const hr = (h: number) => h * 60 * 60 * 1000;
const min = (m: number) => m * 60 * 1000;

// ─────────────────────────────────────────────
//  In-Memory Database (swap for Postgres/Mongo later)
// ─────────────────────────────────────────────
export const db = {
  targets: [
    {
      id: 'tgt-001',
      title: 'Database Migration',
      description: 'Migrate legacy MySQL tables to Postgres with zero downtime.',
      status: TargetStatus.TRACKING,
      severity: 5,
      sector: 45,
      category: 'Engineering',
      launchTimestamp: now - hr(5),
      impactTimestamp: now + hr(2),
      tags: ['backend', 'critical', 'database'],
    },
    {
      id: 'tgt-002',
      title: 'Frontend Component Library',
      description: 'Build reusable Radar UI components in Storybook.',
      status: TargetStatus.TRACKING,
      severity: 2,
      sector: 120,
      category: 'Engineering',
      launchTimestamp: now - hr(2),
      impactTimestamp: now + hr(10),
      tags: ['ui', 'frontend'],
    },
    {
      id: 'tgt-003',
      title: 'Q3 Budget Report',
      description: 'Submit branch financial summary to HQ.',
      status: TargetStatus.TRACKING,
      severity: 4,
      sector: 210,
      category: 'Operations',
      launchTimestamp: now - hr(24),
      impactTimestamp: now + min(45),
      tags: ['finance', 'reporting', 'urgent'],
    },
    {
      id: 'tgt-004',
      title: 'Staff Training Session',
      description: 'Onboard new team members to Aegis protocols.',
      status: TargetStatus.INTERCEPTED,
      severity: 3,
      sector: 300,
      category: 'HR',
      launchTimestamp: now - hr(10),
      impactTimestamp: now + hr(5),
      tags: ['hr', 'training'],
    },
    {
      id: 'tgt-005',
      title: 'Security Audit Review',
      description: 'Review penetration test results with security team.',
      status: TargetStatus.TRACKING,
      severity: 5,
      sector: 330,
      category: 'Security',
      launchTimestamp: now - hr(48),
      impactTimestamp: now - hr(1), // Already impacted
      tags: ['security', 'audit'],
    },
    {
      id: 'tgt-006',
      title: 'Client Demo Preparation',
      description: 'Prepare slides and live demo environment for Acme Corp.',
      status: TargetStatus.NEUTRALIZED,
      severity: 3,
      sector: 75,
      category: 'Sales',
      launchTimestamp: now - hr(72),
      impactTimestamp: now - hr(24),
      tags: ['sales', 'client'],
    },
  ] as ITarget[],

  interceptors: [
    {
      id: 'int-001',
      targetId: 'tgt-004',
      type: InterceptorType.MEETING,
      label: 'Team standup + onboarding block',
      startTime: now + hr(1),
      duration: 90,
      isConfirmed: true,
      notes: 'Conference room B — bring printed materials.',
    },
  ] as IInterceptor[],

  // Simple ID generator
  generateId: (prefix: string): string =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
};
