import type { Request, Response, NextFunction } from 'express';

export class AegisError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AegisError';
  }
}

export const systemShield = (
  err: Error | AegisError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const code = 'code' in err ? err.code : 'SYSTEM_FAULT';

  console.error(`\n[CRITICAL FAULT DETECTED]`);
  console.error(`Code    : ${code}`);
  console.error(`Message : ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Stack   : ${err.stack}\n`);
  }

  res.status(statusCode).json({
    systemStatus: 'FAULT',
    code,
    error: statusCode === 500 ? 'Aegis Core Malfunction' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { debug: err.message }),
  });
};
