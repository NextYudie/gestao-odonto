import { DoctorModel } from "@/models/Doctor";
import { ApiResponse, Doctor, PaginatedResponse } from "@/types";
import { validateDoctorInput } from "@/utils/validation";
import { Request, Response } from "express";

export class DoctorController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const offset = (page - 1) * limit;

      const result = await DoctorModel.findAll(limit, offset, search);

      res.status(200).json({
        success: true,
        message: "Médicos recuperados com sucesso",
        data: result,
      } as ApiResponse<PaginatedResponse<Doctor>>);
    } catch (error) {
      console.error("Get doctors error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "ID inválido",
        } as ApiResponse);
        return;
      }

      const doctor = await DoctorModel.findById(id);
      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Médico não encontrado",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Médico encontrado com sucesso",
        data: doctor,
      } as ApiResponse<Doctor>);
    } catch (error) {
      console.error("Get doctor error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const doctorData = req.body;

      // Validate input
      const validation = validateDoctorInput(doctorData);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          error: validation.errors.join(", "),
        } as ApiResponse);
        return;
      }

      // // Check if CRM already exists
      // const existingDoctor = await DoctorModel.findByCrm(doctorData.crm);
      // if (existingDoctor) {
      //   res.status(409).json({
      //     success: false,
      //     message: 'Médico com este CRM já existe'
      //   } as ApiResponse);
      //   return;
      // }

      const doctorId = await DoctorModel.create(doctorData);
      const newDoctor = await DoctorModel.findById(doctorId);

      res.status(201).json({
        success: true,
        message: "Médico criado com sucesso",
        data: newDoctor,
      } as ApiResponse<Doctor>);
    } catch (error) {
      console.error("Create doctor error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const doctorData = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "ID inválido",
        } as ApiResponse);
        return;
      }

      // Check if doctor exists
      const existingDoctor = await DoctorModel.findById(id);
      if (!existingDoctor) {
        res.status(404).json({
          success: false,
          message: "Médico não encontrado",
        } as ApiResponse);
        return;
      }

      // Validate input
      const validation = validateDoctorInput(doctorData, true);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          error: validation.errors.join(", "),
        } as ApiResponse);
        return;
      }

      // Check CRM uniqueness if it's being updated
      if (doctorData.crm && doctorData.crm !== existingDoctor.crm) {
        const crmExists = await DoctorModel.findByCrm(doctorData.crm);
        if (crmExists) {
          res.status(409).json({
            success: false,
            message: "CRM já está em uso por outro médico",
          } as ApiResponse);
          return;
        }
      }

      const updated = await DoctorModel.update(id, doctorData);
      if (!updated) {
        res.status(400).json({
          success: false,
          message: "Nenhuma alteração foi feita",
        } as ApiResponse);
        return;
      }

      const updatedDoctor = await DoctorModel.findById(id);

      res.status(200).json({
        success: true,
        message: "Médico atualizado com sucesso",
        data: updatedDoctor,
      } as ApiResponse<Doctor>);
    } catch (error) {
      console.error("Update doctor error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "ID inválido",
        } as ApiResponse);
        return;
      }

      const deleted = await DoctorModel.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Médico não encontrado",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Médico excluído com sucesso",
      } as ApiResponse);
    } catch (error) {
      console.error("Delete doctor error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
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
          message: "ID inválido",
        } as ApiResponse);
        return;
      }

      if (!["active", "inactive"].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido. Use "active" ou "inactive"',
        } as ApiResponse);
        return;
      }

      const updated = await DoctorModel.updateStatus(id, status);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: "Médico não encontrado",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Status do médico atualizado com sucesso",
      } as ApiResponse);
    } catch (error) {
      console.error("Update doctor status error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await DoctorModel.getDoctorStats();

      res.status(200).json({
        success: true,
        message: "Estatísticas dos médicos recuperadas com sucesso",
        data: stats,
      } as ApiResponse);
    } catch (error) {
      console.error("Get doctor stats error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }
}
