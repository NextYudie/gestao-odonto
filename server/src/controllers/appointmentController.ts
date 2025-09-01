import { query, Request, Response } from 'express';
import { AppointmentModel } from '@/models/Appointment';
import { ApiResponse, Appointment, PaginatedResponse } from '@/types';
import { validateAppointmentInput } from '@/utils/validation';
import { PatientModel } from '@/models/Patient';

interface AppointmentWithDetails extends Appointment {
  patient_name: string;
  doctor_name: string;
}

export class AppointmentController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;
      const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
      const status = req.query.status as string;
      const date = req.query.date as string;
      const offset = (page - 1) * limit;

      const result = await AppointmentModel.findAll(limit, offset, doctorId, patientId, status, date);
      const resultWithPatient = result.data.forEach(async(item)=>{
        const patient= await PatientModel.findById(item.patient_id)
        const response = {
          ...item,
          patient
        }
        return response
      })
      console.log (resultWithPatient)

      res.status(200).json({
        success: true,
        message: 'Agendamentos recuperados com sucesso',
        data: result
      } as ApiResponse<PaginatedResponse<AppointmentWithDetails>>);

    } catch (error) {
      console.error('Get appointments error:', error);
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

      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Agendamento encontrado com sucesso',
        data: appointment
      } as ApiResponse<AppointmentWithDetails>);

    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const appointmentData = req.body;

      // Validate input
      const validation = validateAppointmentInput(appointmentData);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      const appointmentId = await AppointmentModel.create(appointmentData);
      const newAppointment = await AppointmentModel.findById(appointmentId);

      res.status(201).json({
        success: true,
        message: 'Agendamento criado com sucesso',
        data: newAppointment
      } as ApiResponse<AppointmentWithDetails>);

    } catch (error) {
      if (error instanceof Error && error.message === 'Horário já ocupado para este médico') {
        res.status(409).json({
          success: false,
          message: error.message
        } as ApiResponse);
        return;
      }

      console.error('Create appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      // Check if appointment exists
      const existingAppointment = await AppointmentModel.findById(id);
      if (!existingAppointment) {
        res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        } as ApiResponse);
        return;
      }

      // Validate input for updates
      const validation = validateAppointmentInput(appointmentData, true);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      const updated = await AppointmentModel.update(id, appointmentData);
      if (!updated) {
        res.status(400).json({
          success: false,
          message: 'Nenhuma alteração foi feita'
        } as ApiResponse);
        return;
      }

      const updatedAppointment = await AppointmentModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Agendamento atualizado com sucesso',
        data: updatedAppointment
      } as ApiResponse<AppointmentWithDetails>);

    } catch (error) {
      console.error('Update appointment error:', error);
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

      if (!['scheduled', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        } as ApiResponse);
        return;
      }

      const updated = await AppointmentModel.updateStatus(id, status);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Status do agendamento atualizado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Update appointment status error:', error);
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

      const deleted = await AppointmentModel.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Agendamento excluído com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Delete appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getTodayAppointments(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;
      
      const appointments = await AppointmentModel.getTodayAppointments(doctorId);

      res.status(200).json({
        success: true,
        message: 'Agendamentos de hoje recuperados com sucesso',
        data: appointments
      } as ApiResponse<AppointmentWithDetails[]>);

    } catch (error) {
      console.error('Get today appointments error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AppointmentModel.getAppointmentStats();

      res.status(200).json({
        success: true,
        message: 'Estatísticas dos agendamentos recuperadas com sucesso',
        data: stats
      } as ApiResponse);

    } catch (error) {
      console.error('Get appointment stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getAvailableSlots(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const date = req.params.date;

      if (isNaN(doctorId)) {
        res.status(400).json({
          success: false,
          message: 'ID do médico inválido'
        } as ApiResponse);
        return;
      }

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({
          success: false,
          message: 'Data inválida. Use o formato YYYY-MM-DD'
        } as ApiResponse);
        return;
      }

      const availableSlots = await AppointmentModel.getAvailableSlots(doctorId, date);

      res.status(200).json({
        success: true,
        message: 'Horários disponíveis recuperados com sucesso',
        data: availableSlots
      } as ApiResponse<string[]>);

    } catch (error) {
      console.error('Get available slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}