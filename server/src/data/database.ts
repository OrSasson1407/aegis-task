import { type ITarget, TargetStatus } from '../models/Target.js';

// Aegis System Memory (In-Memory Database)
// Later, this file will contain your connection to MongoDB or Postgres.
export const db = {
  targets: [
    {
      id: '1',
      title: 'Database Migration',
      status: TargetStatus.TRACKING,
      severity: 4,
      sector: 45,
      launchTimestamp: Date.now() - (1000 * 60 * 60 * 5),
      impactTimestamp: Date.now() + (1000 * 60 * 60 * 2), // 2 hours remaining
      tags: ['backend', 'critical']
    },
    {
      id: '2',
      title: 'Frontend Component Library',
      status: TargetStatus.TRACKING,
      severity: 2,
      sector: 120,
      launchTimestamp: Date.now() - (1000 * 60 * 60 * 2),
      impactTimestamp: Date.now() + (1000 * 60 * 60 * 10), // 10 hours remaining
      tags: ['ui']
    }
  ] as ITarget[]
};