import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '../../uploads/signatures');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadSignature = (req: Request, res: Response) => {
  const { patientId, signature, type } = req.body;

  if (!patientId || !signature || !type) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (type === 'digital') {
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
    const fileName = `signature_${patientId}_${Date.now()}.png`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.error('Error saving signature:', err);
        return res.status(500).json({ success: false, message: 'Failed to save signature' });
      }
      res.status(201).json({ success: true, message: 'Signature uploaded successfully', data: { fileName } });
    });
  } else if (type === 'pdf' && req.file) {
    res.status(201).json({ success: true, message: 'Signature uploaded successfully', data: { fileName: req.file.filename } });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature type or missing file' });
  }
};

export const getSignaturesByPatient = (req: Request, res: Response) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ success: false, message: 'Patient ID is required' });
  }

  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      console.error('Error reading signatures directory:', err);
      return res.status(500).json({ success: false, message: 'Failed to read signatures' });
    }

    const patientSignatures = files
      .filter(file => file.startsWith(`signature_${patientId}_`))
      .map(file => {
        const filePath = path.join(UPLOAD_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          fileName: file,
          url: `/uploads/signatures/${file}`,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.status(200).json({ success: true, data: patientSignatures });
  });
};
