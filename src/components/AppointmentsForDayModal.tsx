import React from 'react';
import type { Appointment } from '@/types/Appointment';

interface AppointmentsForDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  appointments: Appointment[];
}

const AppointmentsForDayModal: React.FC<AppointmentsForDayModalProps> = ({ isOpen, onClose, date, appointments }) => {
  if (!isOpen || !date) return null;

  const appointmentsForDay = appointments.filter(app => {
    const appDate = new Date(app.appointment_date);
    return appDate.getFullYear() === date.getFullYear() &&
           appDate.getMonth() === date.getMonth() &&
           appDate.getDate() === date.getDate();
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Agendamentos para {date.toLocaleDateString('pt-BR')}
          </h3>
          
          <div className="space-y-4">
            {appointmentsForDay.length > 0 ? (
              appointmentsForDay.map(app => (
                <div key={app.id} className="p-3 bg-gray-50 rounded-lg border">
                  <p className="font-semibold">{app.patient?.name || 'Paciente não encontrado'}</p>
                  <p className="text-sm text-gray-600">Dr(a). {app.doctor?.name || 'Médico não encontrado'}</p>
                  <p className="text-sm text-gray-600">Horário: {app.appointment_time}</p>
                  <p className="text-sm text-gray-600">Status: {app.status}</p>
                </div>
              ))
            ) : (
              <p>Nenhum agendamento para este dia.</p>
            )}
          </div>

          <div className="items-center px-4 py-3 mt-4 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsForDayModal;
