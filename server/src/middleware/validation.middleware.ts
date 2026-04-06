import type { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema } from 'zod';

/**
 * Generic Zod validation middleware factory.
 * Usage: router.post('/', validate(MySchema), controller)
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        systemStatus: 'INVALID_PAYLOAD',
        error: 'Radar data failed integrity check.',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }

    // Attach parsed (sanitized) data back to body
    req.body = result.data;
    next();
  };

// ─── Target Schemas ──────────────────────────────────────────────────────────
export const CreateTargetSchema = z.object({
  title:          z.string().min(2).max(120),
  description:    z.string().max(500).optional(),
  severity:       z.number().int().min(1).max(5).default(1),
  sector:         z.number().int().min(0).max(359).optional(),
  impactTimestamp:z.number().int().positive(),
  category:       z.string().max(50).optional(),
  tags:           z.array(z.string().max(30)).max(10).default([]),
});

export const UpdateTargetSchema = z.object({
  title:          z.string().min(2).max(120).optional(),
  description:    z.string().max(500).optional(),
  severity:       z.number().int().min(1).max(5).optional(),
  sector:         z.number().int().min(0).max(359).optional(),
  impactTimestamp:z.number().int().positive().optional(),
  category:       z.string().max(50).optional(),
  tags:           z.array(z.string().max(30)).max(10).optional(),
  status:         z.enum(['TRACKING','INTERCEPTED','IMPACTED','NEUTRALIZED']).optional(),
});

// ─── Interceptor Schemas ─────────────────────────────────────────────────────
export const CreateInterceptorSchema = z.object({
  targetId:  z.string().min(1),
  type:      z.enum(['DEEP_WORK', 'QUICK_FIX', 'MEETING', 'REVIEW', 'RESEARCH']),
  label:     z.string().max(120).optional(),
  notes:     z.string().max(500).optional(),
  startTime: z.number().int().positive(),
  duration:  z.number().int().min(5).max(480), // 5 min – 8 hours
});

export const UpdateInterceptorSchema = z.object({
  label:       z.string().max(120).optional(),
  notes:       z.string().max(500).optional(),
  startTime:   z.number().int().positive().optional(),
  duration:    z.number().int().min(5).max(480).optional(),
  isConfirmed: z.boolean().optional(),
  status:      z.enum(['PLANNED','ACTIVE','COMPLETED','ABORTED']).optional(),
});
