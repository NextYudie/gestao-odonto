import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ApiResponse } from '@/types';

// General rate limiter
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Number of requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000, // Per 15 minutes (in seconds)
});

// Strict rate limiter for authentication endpoints
const authRateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
});

export const generalRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rateLimiterRes: any) {
    const remainingSeconds = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
    
    res.set('Retry-After', String(remainingSeconds));
    res.status(429).json({
      success: false,
      message: `Muitas requisições. Tente novamente em ${remainingSeconds} segundos.`
    } as ApiResponse);
  }
};

export const authRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authRateLimiter.consume(req.ip);
    next();
  } catch (rateLimiterRes: any) {
    const remainingSeconds = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
    
    res.set('Retry-After', String(remainingSeconds));
    res.status(429).json({
      success: false,
      message: `Muitas tentativas de login. Tente novamente em ${Math.ceil(remainingSeconds / 60)} minutos.`
    } as ApiResponse);
  }
};

// Rate limiter for password reset attempts
export const passwordResetRateLimit = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.body.email || req.ip,
  points: 3, // Number of attempts
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
});

export const resetPasswordRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const key = req.body.email || req.ip;
    await passwordResetRateLimit.consume(key);
    next();
  } catch (rateLimiterRes: any) {
    const remainingSeconds = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
    
    res.set('Retry-After', String(remainingSeconds));
    res.status(429).json({
      success: false,
      message: `Muitas tentativas de recuperação de senha. Tente novamente em ${Math.ceil(remainingSeconds / 60)} minutos.`
    } as ApiResponse);
  }
};