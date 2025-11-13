import type { Appointment } from '@/types/Appointment';
import { useMemo } from 'react';

const AppointmentsTable = ({ appointments, onDelete }: { appointments: Appointment[], onDelete: (id: number) => void }) => {
  const upcomingAppointments = useMemo(() => {
    if (!appointments) return [];
    const now = new Date();
    // Set time to 00:00:00 to include all of today's appointments
    now.setHours(0, 0, 0, 0);

    return appointments
      .filter(app => new Date(app.appointment_date) >= now && app.status !== 'cancelled' && app.status !== 'completed')
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime() || a.appointment_time.localeCompare(b.appointment_time));
  }, [appointments]);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-300 text-green-800',
      scheduled: 'bg-yellow-200 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.scheduled;
  };

  const getStatusText = (status) => {
    const texts = {
      confirmed: 'Confirmado',
      scheduled: 'Agendado',
      cancelled: 'Cancelado'
    };
    return texts[status] || 'Agendado';
  };

  const handleEdit = (appointmentId) => {
    console.log('Editando agendamento:', appointmentId);
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm('Deseja realmente excluir este agendamento?')) {
      onDelete(appointmentId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Próximos Agendamentos</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Paciente</th>
              <th className="text-left p-3">Especialidade</th>
              <th className="text-left p-3">Data/Hora</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">{appointment.patient?.name || 'N/A'}</td>
                  <td className="p-3">{appointment.specialty}</td>
                  <td className="p-3">{new Date(appointment.appointment_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} {appointment.appointment_time}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="text-amber-600 hover:text-amber-800 mr-2 transition-colors"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Excluir"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  Nenhum agendamento próximo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;