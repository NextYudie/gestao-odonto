const AppointmentsTable = ({ appointments }) => {
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-300 text-green-800',
      pending: 'bg-yellow-200 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      confirmed: 'Confirmado',
      pending: 'Pendente',
      cancelled: 'Cancelado'
    };
    return texts[status] || 'Pendente';
  };

  const handleEdit = (appointmentId) => {
    console.log('Editando agendamento:', appointmentId);
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm('Deseja realmente excluir este agendamento?')) {
      console.log('Excluindo agendamento:', appointmentId);
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
            
            {appointments?.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">{appointment.patient.name}</td>
                <td className="p-3">{appointment.specialty}</td>
                <td className="p-3">{appointment.appointment_date} {appointment.appointment_time}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(appointment.id)}
                    className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;