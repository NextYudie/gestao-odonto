import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { AppointmentFormData } from "../types";
import AppointmentModal from "./AppointmentModal";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] =
    useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(3);

  const handleAppointmentSubmit = (
    appointmentData: AppointmentFormData
  ): void => {
    console.log("Nova consulta criada:", appointmentData);
    setIsAppointmentModalOpen(false);
  };

  const handleNewAppointment = (): void => {
    setIsAppointmentModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
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
