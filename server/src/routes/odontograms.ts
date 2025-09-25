import { Router } from 'express';
import { OdontogramController } from '@/controllers/odontogramController';
import { authenticateToken, requireStaff } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all odontogram routes
router.use(authenticateToken);
router.use(requireStaff);

// GET /api/odontograms/patient/:patientId
router.get('/patient/:patientId', asyncHandler(OdontogramController.getByPatientId));

// GET /api/odontograms/:id
router.get('/:id', asyncHandler(OdontogramController.getById));

// POST /api/odontograms
router.post('/', asyncHandler(OdontogramController.create));

// PUT /api/odontograms/:id
router.put('/:id', asyncHandler(OdontogramController.update));

// DELETE /api/odontograms/:id
router.delete('/:id', asyncHandler(OdontogramController.delete));

export default router;
