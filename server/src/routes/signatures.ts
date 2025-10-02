import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadSignature, getSignaturesByPatient } from '@/controllers/signatureController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/signatures/')
  },
  filename: function (req, file, cb) {
    const patientId = req.body.patientId || 'unknown';
    cb(null, `signature_${patientId}_${Date.now()}${path.extname(file.originalname)}`)
  }
});

const upload = multer({ storage: storage });

router.post('/upload', authenticateToken, upload.single('signature'), uploadSignature);
router.get('/patient/:patientId', authenticateToken, getSignaturesByPatient);

export default router;
