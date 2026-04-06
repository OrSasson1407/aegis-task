import type { Request, Response, NextFunction } from 'express';

/**
 * API Key Guard — checks for X-Aegis-Key header.
 * Only active when AEGIS_API_KEY is set in the environment.
 * In development with no key set, all requests pass through.
 */
export const apiKeyGuard = (req: Request, res: Response, next: NextFunction): void => {
  const expectedKey = process.env.AEGIS_API_KEY;

  // If no key is configured, skip auth (dev/open mode)
  if (!expectedKey) {
    next();
    return;
  }

  const providedKey = req.headers['x-aegis-key'];

  if (!providedKey || providedKey !== expectedKey) {
    res.status(401).json({
      systemStatus: 'ACCESS_DENIED',
      error: 'Invalid or missing Aegis API key.',
    });
    return;
  }

  next();
};
