import React, { useState, useEffect } from 'react';
import apiService from '@/services/api';
import { format } from 'date-fns';
import type { Appointment } from "../types/Appointment";

interface PagamentoTabProps {
  patientId: number;
}

const PagamentoTab: React.FC<PagamentoTabProps> = ({ patientId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        // This endpoint doesn't exist yet. I'll need to create it.
        // For now, I'll assume it will be something like this.
        const response = await apiService.getAppointmentsByPatient(patientId);
        if (response.success && response.data) {
          setAppointments(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const handlePaymentChange = async (appointmentId: number, paid: boolean) => {
    try {
        // This endpoint also needs to be created.
      await apiService.updateAppointmentPayment(appointmentId, { paid });
      setAppointments(prev =>
        prev.map(app => (app.id === appointmentId ? { ...app, paid } : app))
      );
    } catch (error) {
      alert('Erro ao atualizar status de pagamento.');
    }
  };

  if (loading) return <p>Carregando pagamentos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Controle de Pagamentos</h3>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map(app => (
            <div key={app.id} className="p-4 border rounded-md bg-gray-50 flex justify-between items-center">
              <div>
                <p><strong>Data:</strong> {format(new Date(`${app.appointment_date}T${app.appointment_time}`), 'dd/MM/yyyy HH:mm')}</p>
                <p><strong>Descrição:</strong> {app.notes || 'N/A'}</p>
              </div>
              <div className="flex items-center">
                <label htmlFor={`paid-toggle-${app.id}`} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`paid-toggle-${app.id}`}
                      className="sr-only peer"
                      checked={!!app.paid}
                      onChange={(e) => handlePaymentChange(app.id, e.target.checked)}
                    />
                    {/* Track */}
                    <div className="block w-14 h-8 rounded-full bg-gray-200 peer-checked:bg-amber-500 transition-colors duration-200 ease-in-out"></div>
                    {/* Knob */}
                    <div className="absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow peer-checked:translate-x-full transition-transform duration-200 ease-in-out"></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">
                    {app.paid ? 'Pago' : 'Pendente'}
                  </div>
                </label>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum agendamento encontrado para este paciente.</p>
        )}
      </div>
    </div>
  );
};

export default PagamentoTab;
