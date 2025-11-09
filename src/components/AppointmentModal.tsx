import { useEffect, useState } from 'react';
import { useDoctors } from '../hooks/useDoctors';
import { usePatients } from '../hooks/usePatients';
import type { Doctor, Patient } from '../types';

const AppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const { doctors, fetchDoctors } = useDoctors();
  const { patients, fetchPatients } = usePatients();

  const [formData, setFormData] = useState({
    patient_id: null as number | null,
    doctor_id: null as number | null,
    specialty: '', // This will come from the selected doctor
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Fetch doctors and patients on component mount and when search terms change
  useEffect(() => {
    fetchDoctors(1, 10, doctorSearchTerm);
  }, [doctorSearchTerm, fetchDoctors]);

  useEffect(() => {
    fetchPatients(1, 10, patientSearchTerm);
  }, [patientSearchTerm, fetchPatients]);

  // Update specialty when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      setFormData(prev => ({ ...prev, doctor_id: selectedDoctor.id, specialty: selectedDoctor.specialty }));
    } else {
      setFormData(prev => ({ ...prev, doctor_id: null, specialty: '' }));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedPatient) {
      setFormData(prev => ({ ...prev, patient_id: selectedPatient.id }));
    } else {
      setFormData(prev => ({ ...prev, patient_id: null }));
    }
  }, [selectedPatient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDoctorSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctorSearchTerm(e.target.value);
    setSelectedDoctor(null); // Clear selected doctor when searching
  };

  const handlePatientSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientSearchTerm(e.target.value);
    setSelectedPatient(null); // Clear selected patient when searching
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDoctorSearchTerm(`${doctor.name} (${doctor.specialty})`); // Display selected doctor in search input
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(patient.name); // Display selected patient in search input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.doctor_id || !formData.appointment_date || !formData.appointment_time) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    await onSubmit({
      patient_id: formData.patient_id,
      doctor_id: formData.doctor_id,
      specialty: formData.specialty,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      notes: formData.notes,
    });
    setFormData({
      patient_id: null,
      doctor_id: null,
      specialty: '',
      appointment_date: '',
      appointment_time: '',
      notes: ''
    });
    setSelectedDoctor(null);
    setSelectedPatient(null);
    setDoctorSearchTerm('');
    setPatientSearchTerm('');
  };

  const handleClose = () => {
    setFormData({
      patient_id: null,
      doctor_id: null,
      specialty: '',
      appointment_date: '',
      appointment_time: '',
      notes: ''
    });
    setSelectedDoctor(null);
    setSelectedPatient(null);
    setDoctorSearchTerm('');
    setPatientSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-lg w-full max-w-md mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Novo Agendamento</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Search Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">
              Paciente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientSearchTerm}
              onChange={handlePatientSearchChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar paciente por nome"
              required
            />
            {patientSearchTerm && !selectedPatient && patients.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {patients.map((patientItem) => (
                  <li
                    key={patientItem.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectPatient(patientItem)}
                  >
                    {patientItem.name}
                  </li>
                ))}
              </ul>
            )}
            {selectedPatient && (
              <p className="mt-2 text-sm text-gray-600">
                Paciente selecionado: <span className="font-medium">{selectedPatient.name}</span>
              </p>
            )}
          </div>

          {/* Doctor Search Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">
              Médico/Especialidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={doctorSearchTerm}
              onChange={handleDoctorSearchChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar médico por nome ou especialidade"
              required
            />
            {doctorSearchTerm && !selectedDoctor && doctors.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {doctors.map((doctorItem) => (
                  <li
                    key={doctorItem.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectDoctor(doctorItem)}
                  >
                    {doctorItem.name} ({doctorItem.specialty})
                  </li>
                ))}
              </ul>
            )}
            {selectedDoctor && (
              <p className="mt-2 text-sm text-gray-600">
                Médico selecionado: <span className="font-medium">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Observações</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Informações adicionais sobre a consulta..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;