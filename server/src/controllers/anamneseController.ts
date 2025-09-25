import { Request, Response } from 'express';
import { AnamneseModel } from '@/models/Anamnese';
import { ApiResponse, Anamnese } from '@/types';
import { validateAnamneseInput } from '@/utils/validation';

export class AnamneseController {
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

      const anamneses = await AnamneseModel.findByPatientId(patientId);

      res.status(200).json({
        success: true,
        message: 'Anamneses recuperadas com sucesso',
        data: anamneses
      } as ApiResponse<Anamnese[]>);

    } catch (error) {
      console.error('Get anamneses error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID da anamnese inválido'
        } as ApiResponse);
        return;
      }

      const anamnese = await AnamneseModel.findById(id);
      if (!anamnese) {
        res.status(404).json({
          success: false,
          message: 'Anamnese não encontrada'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Anamnese encontrada com sucesso',
        data: anamnese
      } as ApiResponse<Anamnese>);

    } catch (error) {
      console.error('Get anamnese error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const anamneseData = req.body;

      const validation = validateAnamneseInput(anamneseData);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      const anamneseId = await AnamneseModel.create(anamneseData);
      const newAnamnese = await AnamneseModel.findById(anamneseId);

      res.status(201).json({
        success: true,
        message: 'Anamnese criada com sucesso',
        data: newAnamnese
      } as ApiResponse<Anamnese>);

    } catch (error) {
      console.error('Create anamnese error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      } as ApiResponse);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const anamneseData = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID da anamnese inválido'
        } as ApiResponse);
        return;
      }

      const existingAnamnese = await AnamneseModel.findById(id);
      if (!existingAnamnese) {
        res.status(404).json({
          success: false,
          message: 'Anamnese não encontrada'
        } as ApiResponse);
        return;
      }

      const validation = validateAnamneseInput(anamneseData, true);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      const updated = await AnamneseModel.update(id, anamneseData);
      if (!updated) {
        res.status(400).json({
          success: false,
          message: 'Nenhuma alteração foi feita'
        } as ApiResponse);
        return;
      }

      const updatedAnamnese = await AnamneseModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Anamnese atualizada com sucesso',
        data: updatedAnamnese
      } as ApiResponse<Anamnese>);

    } catch (error) {
      console.error('Update anamnese error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID da anamnese inválido'
        } as ApiResponse);
        return;
      }

      const deleted = await AnamneseModel.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Anamnese não encontrada'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Anamnese excluída com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Delete anamnese error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}
