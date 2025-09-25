import { Router } from 'express';
import { AnamneseController } from '@/controllers/anamneseController';
import { authenticateToken, requireStaff } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all anamnesis routes
router.use(authenticateToken);
router.use(requireStaff);

// GET /api/anamneses/patient/:patientId
router.get('/patient/:patientId', asyncHandler(AnamneseController.getByPatientId));

// GET /api/anamneses/:id
router.get('/:id', asyncHandler(AnamneseController.getById));

// POST /api/anamneses
router.post('/', asyncHandler(AnamneseController.create));

// PUT /api/anamneses/:id
router.put('/:id', asyncHandler(AnamneseController.update));

// DELETE /api/anamneses/:id
router.delete('/:id', asyncHandler(AnamneseController.delete));

export default router;
