import { Router } from 'express';
import { PatientController } from '@/controllers/patientController';
import { authenticateToken, requireStaff } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all patient routes
router.use(authenticateToken);
router.use(requireStaff);

// GET /api/patients
router.get('/', asyncHandler(PatientController.getAll));

// GET /api/patients/stats
router.get('/stats', asyncHandler(PatientController.getStats));

// GET /api/patients/:id
router.get('/:id', asyncHandler(PatientController.getById));

// POST /api/patients
router.post('/', asyncHandler(PatientController.create));

// PUT /api/patients/:id
router.put('/:id', asyncHandler(PatientController.update));

// PATCH /api/patients/:id/status
router.patch('/:id/status', asyncHandler(PatientController.updateStatus));

// DELETE /api/patients/:id
router.delete('/:id', asyncHandler(PatientController.delete));

export default router;