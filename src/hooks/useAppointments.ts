import { useEffect, useState } from "react";
import apiService from "../services/api";
import type { Appointment } from "../types";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAppointments();

      if (response.success && response.data) {
        setAppointments(response.data);
      } else {
        setError("Erro ao carregar agendamentos");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      setError(null);
      const response = await apiService.getTodayAppointments();

      if (response.success && response.data) {
        setTodayAppointments(response.data);
      } else {
        setError("Erro ao carregar agendamentos de hoje");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar agendamentos de hoje");
    }
  };

  const createAppointment = async (
    appointmentData: Omit<Appointment, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setError(null);
      const response = await apiService.createAppointment(appointmentData);

      if (response.success && response.data) {
        setAppointments((prev) => [...prev, response.data!]);

        // Update today appointments if the new appointment is for today
        const today = new Date().toISOString().split("T")[0];
        if (response.data!.appointment_date === today) {
          setTodayAppointments((prev) => [...prev, response.data!]);
        }

        return response.data;
      } else {
        throw new Error(response.message || "Erro ao criar agendamento");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar agendamento");
      throw err;
    }
  };

  const updateAppointment = async (
    id: number,
    appointmentData: Partial<Appointment>
  ) => {
    try {
      setError(null);
      const response = await apiService.updateAppointment(id, appointmentData);

      if (response.success && response.data) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? { ...appointment, ...response.data }
              : appointment
          )
        );

        setTodayAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? { ...appointment, ...response.data }
              : appointment
          )
        );

        return response.data;
      } else {
        throw new Error(response.message || "Erro ao atualizar agendamento");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar agendamento");
      throw err;
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      setError(null);
      const response = await apiService.deleteAppointment(id);

      if (response.success) {
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== id)
        );
        setTodayAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== id)
        );
      } else {
        throw new Error(response.message || "Erro ao excluir agendamento");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao excluir agendamento");
      throw err;
    }
  };

  const getAppointment = async (id: number): Promise<Appointment | null> => {
    try {
      setError(null);
      const response = await apiService.getAppointment(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Erro ao carregar agendamento");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar agendamento");
      return null;
    }
  };

  const getAvailableSlots = async (
    doctorId: number,
    date: string
  ): Promise<string[]> => {
    try {
      setError(null);
      const response = await apiService.getAvailableSlots(doctorId, date);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(
          response.message || "Erro ao carregar horários disponíveis"
        );
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar horários disponíveis");
      return [];
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchTodayAppointments();
  }, []);

  return {
    appointments,
    todayAppointments,
    loading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    getAvailableSlots,
    setError,
  };
};
