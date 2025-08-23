import { useEffect, useState } from "react";
import apiService from "../services/api";
import type { Patient } from "../types";

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPatients();

      if (response.success && response.data) {
        setPatients(response.data);
      } else {
        setError("Erro ao carregar pacientes");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar pacientes");
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (
    patientData: Omit<Patient, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setError(null);
      const response = await apiService.createPatient(patientData);

      if (response.success && response.data) {
        setPatients((prev) => [...prev, response.data!]);
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao criar paciente");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar paciente");
      throw err;
    }
  };

  const updatePatient = async (id: number, patientData: Partial<Patient>) => {
    try {
      setError(null);
      const response = await apiService.updatePatient(id, patientData);

      if (response.success && response.data) {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === id ? { ...patient, ...response.data } : patient
          )
        );
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao atualizar paciente");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar paciente");
      throw err;
    }
  };

  const deletePatient = async (id: number) => {
    try {
      setError(null);
      const response = await apiService.deletePatient(id);

      if (response.success) {
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
      } else {
        throw new Error(response.message || "Erro ao excluir paciente");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao excluir paciente");
      throw err;
    }
  };

  const getPatient = async (id: number): Promise<Patient | null> => {
    try {
      setError(null);
      const response = await apiService.getPatient(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao carregar paciente");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar paciente");
      return null;
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatient,
    setError,
  };
};
