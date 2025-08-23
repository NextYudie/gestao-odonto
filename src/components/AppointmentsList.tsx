const AppointmentsList = ({ appointments }) => {
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      confirmed: 'Confirmada',
      pending: 'Pendente',
      cancelled: 'Cancelada'
    };
    return texts[status] || 'Pendente';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Consultas do Dia</h2>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-medium">{appointment.patient}</p>
              <p className="text-sm text-gray-600">{appointment.time}</p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;