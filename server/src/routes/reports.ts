import { Router } from 'express';
import { getReports } from '@/controllers/reportsController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

router.get('/', authenticateToken, getReports);

export default router;
