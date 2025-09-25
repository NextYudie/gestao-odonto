import { Request, Response } from 'express';
import { OdontogramModel } from '@/models/Odontogram';
import { ApiResponse, Odontogram } from '@/types';
import { validateOdontogramInput } from '@/utils/validation';

export class OdontogramController {
  static async getByPatientId(req: Request, res: Response): Promise<void> {
    try {
      const patientId = parseInt(req.params.patientId);
      
      if (isNaN(patientId)) {
        res.status(400).json({
          success: false,
          message: 'ID do paciente inválido'
        } as ApiResponse);
        return;
      }

      const odontograms = await OdontogramModel.findByPatientId(patientId);

      res.status(200).json({
        success: true,
        message: 'Odontogramas recuperados com sucesso',
        data: odontograms
      } as ApiResponse<Odontogram[]>);

    } catch (error) {
      console.error('Get odontograms error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      } as ApiResponse);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID do odontograma inválido'
        } as ApiResponse);
        return;
      }

      const odontogram = await OdontogramModel.findById(id);
      if (!odontogram) {
        res.status(404).json({
          success: false,
          message: 'Odontograma não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Odontograma encontrado com sucesso',
        data: odontogram
      } as ApiResponse<Odontogram>);

    } catch (error) {
      console.error('Get odontogram error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      } as ApiResponse);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const odontogramData = req.body;

      const validation = validateOdontogramInput(odontogramData);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      const odontogramId = await OdontogramModel.create(odontogramData);
      const newOdontogram = await OdontogramModel.findById(odontogramId);

      res.status(201).json({
        success: true,
        message: 'Odontograma criado com sucesso',
        data: newOdontogram
      } as ApiResponse<Odontogram>);

    } catch (error) {
      console.error('Create odontogram error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      } as ApiResponse);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const odontogramData = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID do odontograma inválido'
        } as ApiResponse);
        return;
      }

      const existingOdontogram = await OdontogramModel.findById(id);
      if (!existingOdontogram) {
        res.status(404).json({
          success: false,
          message: 'Odontograma não encontrado'
        } as ApiResponse);
        return;
      }

      const validation = validateOdontogramInput(odontogramData, true);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      const updated = await OdontogramModel.update(id, odontogramData);
      if (!updated) {
        res.status(400).json({
          success: false,
          message: 'Nenhuma alteração foi feita'
        } as ApiResponse);
        return;
      }

      const updatedOdontogram = await OdontogramModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Odontograma atualizado com sucesso',
        data: updatedOdontogram
      } as ApiResponse<Odontogram>);

    } catch (error) {
      console.error('Update odontogram error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      } as ApiResponse);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID do odontograma inválido'
        } as ApiResponse);
        return;
      }

      const deleted = await OdontogramModel.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Odontograma não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Odontograma excluído com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Delete odontogram error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      } as ApiResponse);
    }
  }
}
