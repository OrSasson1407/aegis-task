import type { Request, Response, NextFunction } from 'express';

const COLORS = {
  GET:    '\x1b[36m',  // Cyan
  POST:   '\x1b[32m',  // Green
  PUT:    '\x1b[33m',  // Yellow
  PATCH:  '\x1b[33m',  // Yellow
  DELETE: '\x1b[31m',  // Red
  RESET:  '\x1b[0m',
};

export const radarLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method as keyof typeof COLORS;
    const color = COLORS[method] || COLORS.RESET;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';

    console.log(
      `[RADAR] ${timestamp} | ` +
      `${color}${req.method}${COLORS.RESET} ` +
      `${req.originalUrl} | ` +
      `${statusColor}${res.statusCode}${COLORS.RESET} | ` +
      `${duration}ms`
    );
  });

  next();
};
