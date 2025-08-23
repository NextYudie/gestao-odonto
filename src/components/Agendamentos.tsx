import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from './Calendar';
import AppointmentsTable from './AppointmentsTable';

interface OutletContext {
  onNewAppointment: () => void;
}

const Agendamentos: React.FC = () => {
  const { onNewAppointment } = useOutletContext<OutletContext>();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const appointmentsData = [
    {
      id: 1,
      patient: 'Maria Silva',
      specialty: 'Cardiologia',
      date: '25/11/2024',
      time: '09:00',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'João Santos',
      specialty: 'Ortopedia',
      date: '25/11/2024',
      time: '10:15',
      status: 'pending'
    },
    {
      id: 3,
      patient: 'Ana Costa',
      specialty: 'Pediatria',
      date: '25/11/2024',
      time: '11:30',
      status: 'confirmed'
    }
  ];

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
        appointments={appointmentsData}
      />

      <AppointmentsTable appointments={appointmentsData} />
    </div>
  );
};

export default Agendamentos;