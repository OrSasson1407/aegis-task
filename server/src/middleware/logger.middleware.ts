import type { Request, Response, NextFunction } from 'express';

export const radarLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  
  // Log the incoming scan
  console.log(`[RADAR LOG] ${timestamp} | Protocol: ${req.method} | Sector: ${req.originalUrl}`);
  
  // Move to the next function
  next();
};