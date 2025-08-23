import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticateToken } from '@/middleware/auth';
import { authRateLimit } from '@/middleware/rateLimiter';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// POST /api/auth/login
router.post('/login', asyncHandler(AuthController.login));

// POST /api/auth/logout
router.post('/logout', authenticateToken, asyncHandler(AuthController.logout));

// GET /api/auth/me
router.get('/me', authenticateToken, asyncHandler(AuthController.me));

// POST /api/auth/refresh
router.post('/refresh', authenticateToken, asyncHandler(AuthController.refreshToken));

export default router;