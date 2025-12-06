import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from './Calendar';
import AppointmentsTable from './AppointmentsTable';
import { useAppointments } from '../hooks/useAppointments';
import AppointmentsForDayModal from './AppointmentsForDayModal';

interface OutletContext {
  onNewAppointment: () => void;
}

const Agendamentos: React.FC = () => {
  const { onNewAppointment } = useOutletContext<OutletContext>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { appointments } = useAppointments();

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <button
          onClick={onNewAppointment}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Novo Agendamento
        </button>
      </div>

      <Calendar
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        appointments={appointments.data}
        onDayClick={handleDayClick}
      />

      <AppointmentsTable appointments={appointments.data} />

      <AppointmentsForDayModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        date={selectedDate}
        appointments={appointments.data || []}
      />
    </div>
  );
};

export default Agendamentos;