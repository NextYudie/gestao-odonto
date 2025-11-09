import { Router } from 'express';
import { AppointmentController } from '@/controllers/appointmentController';
import { authenticateToken, requireStaff } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all appointment routes
router.use(authenticateToken);
router.use(requireStaff);

// GET /api/appointments
router.get('/', asyncHandler(AppointmentController.getAll));

// GET /api/appointments/today
router.get('/today', asyncHandler(AppointmentController.getTodayAppointments));

// GET /api/appointments/stats
router.get('/stats', asyncHandler(AppointmentController.getStats));

// GET /api/appointments/available-slots/:doctorId/:date
router.get('/available-slots/:doctorId/:date', asyncHandler(AppointmentController.getAvailableSlots));

// GET /api/appointments/:id
router.get('/:id', asyncHandler(AppointmentController.getById));

// GET /api/appointments/patient/:patientId
router.get('/patient/:patientId', asyncHandler(AppointmentController.getAppointmentsByPatient));

// POST /api/appointments
router.post('/', asyncHandler(AppointmentController.create));

// PUT /api/appointments/:id
router.put('/:id', asyncHandler(AppointmentController.update));

// PATCH /api/appointments/:id/status
router.patch('/:id/status', asyncHandler(AppointmentController.updateStatus));

// PATCH /api/appointments/:id/payment
router.patch('/:id/payment', asyncHandler(AppointmentController.updateAppointmentPayment));

// DELETE /api/appointments/:id
router.delete('/:id', asyncHandler(AppointmentController.delete));

export default router;