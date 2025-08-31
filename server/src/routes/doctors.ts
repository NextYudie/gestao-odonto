import { Router } from 'express';
import { DoctorController } from '@/controllers/doctorController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all doctor routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/doctors
router.get('/', asyncHandler(DoctorController.getAll));

// GET /api/doctors/stats
router.get('/stats', asyncHandler(DoctorController.getStats));

// GET /api/doctors/:id
router.get('/:id', asyncHandler(DoctorController.getById));

// POST /api/doctors
router.post('/', asyncHandler(DoctorController.create));

// PUT /api/doctors/:id
router.put('/:id', asyncHandler(DoctorController.update));

// PATCH /api/doctors/:id/status
router.patch('/:id/status', asyncHandler(DoctorController.updateStatus));

// DELETE /api/doctors/:id
router.delete('/:id', asyncHandler(DoctorController.delete));

export default router;