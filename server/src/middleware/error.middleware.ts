import type { Request, Response, NextFunction } from 'express';

// Express recognizes error middleware by the 4 arguments (err, req, res, next)
export const systemShield = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`\n[CRITICAL FAULT DETECTED]`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}\n`);

  res.status(500).json({
    systemStatus: 'FAULT',
    error: 'Aegis Core Malfunction',
    message: err.message || 'Unknown system failure'
  });
};