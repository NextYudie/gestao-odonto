import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { AppointmentFormData } from "../types";
import AppointmentModal from "./AppointmentModal";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAppointments } from "../hooks/useAppointments";
import { usePatients } from "../hooks/usePatients";

const Layout: React.FC = () => {
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { patients } = usePatients();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] =
    useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(3);

  const handleAppointmentSubmit = async (
    appointmentData: AppointmentFormData
  ): Promise<void> => {
    try {
      const patient = patients.find(p => p.name === appointmentData.patient);
      if (!patient) {
        console.error("Paciente não encontrado");
        return;
      }

      await createAppointment({
        patient_id: patient.id,
        doctor_id: user.id,
        specialty: appointmentData.specialty,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        duration: 30, // Default duration
        status: "scheduled", // Default status
        notes: appointmentData.observations,
      });
      setIsAppointmentModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    }
  };

  const handleNewAppointment = (): void => {
    setIsAppointmentModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Sidebar user={user} />

      <div className="flex-1">
        <TopBar notificationCount={notificationCount} user={user} />
        <main>
          <Outlet context={{ onNewAppointment: handleNewAppointment }} />
        </main>
      </div>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={handleAppointmentSubmit}
      />
    </div>
  );
};

export default Layout;
