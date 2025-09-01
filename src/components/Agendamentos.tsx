import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from './Calendar';
import AppointmentsTable from './AppointmentsTable';
import { useAppointments } from '../hooks/useAppointments';

interface OutletContext {
  onNewAppointment: () => void;
}

const Agendamentos: React.FC = () => {
  const { onNewAppointment } = useOutletContext<OutletContext>();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const {appointments}=useAppointments()
  console.log(appointments)
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <button
          onClick={onNewAppointment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Novo Agendamento
        </button>
      </div>

      <Calendar
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        appointments={appointments.data}
      />

      <AppointmentsTable appointments={appointments.data} />
    </div>
  );
};

export default Agendamentos;