import { Request, Response } from 'express';
import { PatientModel } from '@/models/Patient';
import { ApiResponse, Patient, PaginatedResponse } from '@/types';
import { validatePatientInput } from '@/utils/validation';

export class PatientController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const offset = (page - 1) * limit;

      const result = await PatientModel.findAll(limit, offset, search);

      res.status(200).json({
        success: true,
        message: 'Pacientes recuperados com sucesso',
        data: result
      } as ApiResponse<PaginatedResponse<Patient>>);

    } catch (error) {
      console.error('Get patients error:', error);
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
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const patient = await PatientModel.findById(id);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Paciente encontrado com sucesso',
        data: patient
      } as ApiResponse<Patient>);

    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const patientData = req.body;

      // Validate input
      const validation = validatePatientInput(patientData);
      if (!validation.isValid) {
        console.error('Patient validation errors:', validation.errors); // Added log
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      // Check if CPF already exists
      const existingPatient = await PatientModel.findByCpf(patientData.cpf);
      if (existingPatient) {
        res.status(409).json({
          success: false,
          message: 'Paciente com este CPF já existe'
        } as ApiResponse);
        return;
      }

      const patientId = await PatientModel.create(patientData);
      const newPatient = await PatientModel.findById(patientId);

      res.status(201).json({
        success: true,
        message: 'Paciente criado com sucesso',
        data: newPatient
      } as ApiResponse<Patient>);

    } catch (error) {
      console.error('Create patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const patientData = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      // Check if patient exists
      const existingPatient = await PatientModel.findById(id);
      if (!existingPatient) {
        res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        } as ApiResponse);
        return;
      }

      // Validate input
      const validation = validatePatientInput(patientData, true);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      // Check CPF uniqueness if it's being updated
      if (patientData.cpf && patientData.cpf !== existingPatient.cpf) {
        const cpfExists = await PatientModel.findByCpf(patientData.cpf);
        if (cpfExists) {
          res.status(409).json({
            success: false,
            message: 'CPF já está em uso por outro paciente'
          } as ApiResponse);
          return;
        }
      }

      const updated = await PatientModel.update(id, patientData);
      if (!updated) {
        res.status(400).json({
          success: false,
          message: 'Nenhuma alteração foi feita'
        } as ApiResponse);
        return;
      }

      const updatedPatient = await PatientModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Paciente atualizado com sucesso',
        data: updatedPatient
      } as ApiResponse<Patient>);

    } catch (error) {
      console.error('Update patient error:', error);
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
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const deleted = await PatientModel.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Paciente excluído com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      if (!['active', 'inactive'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido. Use "active" ou "inactive"'
        } as ApiResponse);
        return;
      }

      const updated = await PatientModel.updateStatus(id, status);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Status do paciente atualizado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Update patient status error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await PatientModel.getPatientStats();

      res.status(200).json({
        success: true,
        message: 'Estatísticas dos pacientes recuperadas com sucesso',
        data: stats
      } as ApiResponse);

    } catch (error) {
      console.error('Get patient stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}