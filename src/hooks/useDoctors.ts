import { useEffect, useState } from "react";
import apiService from "../services/api";
import type { Doctor, PaginatedResponse } from "../types";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<PaginatedResponse<Doctor> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async (page = 1, limit = 20, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDoctors(page, limit, search);

      if (response.success && response.data) {
        setDoctors(response.data);
      } else {
        setError("Erro ao carregar médicos");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar médicos");
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (
    doctorData: Omit<Doctor, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setError(null);
      const response = await apiService.createDoctor(doctorData);

      if (response.success && response.data) {
        fetchDoctors();
        alert(response.message);
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao criar médico");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar médico");
      alert(err.message);
      throw err;
    }
  };

  const updateDoctor = async (id: number, doctorData: Partial<Doctor>) => {
    try {
      setError(null);
      const response = await apiService.updateDoctor(id, doctorData);

      if (response.success && response.data) {
        fetchDoctors();
        alert(response.message);
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao atualizar médico");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar médico");
      alert(err.message);
      throw err;
    }
  };

  const deleteDoctor = async (id: number) => {
    try {
      setError(null);
      const response = await apiService.deleteDoctor(id);

      if (response.success) {
        fetchDoctors();
      } else {
        throw new Error(response.message || "Erro ao excluir médico");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao excluir médico");
      throw err;
    }
  };

  const getDoctor = async (id: number): Promise<Doctor | null> => {
    try {
      setError(null);
      const response = await apiService.getDoctor(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao carregar médico");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar médico");
      return null;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors: doctors?.data || [],
    pagination: doctors?.pagination,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctor,
    setError,
  };
};
