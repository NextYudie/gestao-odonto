import { useState, useCallback } from 'react';

const mockData = {
  appointments: [
    { id: 1, patient: 'Maria Silva', specialty: 'Cardiologia', date: '2024-11-25', time: '09:00', status: 'confirmed' },
    { id: 2, patient: 'João Santos', specialty: 'Ortopedia', date: '2024-11-25', time: '10:15', status: 'pending' },
    { id: 3, patient: 'Ana Costa', specialty: 'Pediatria', date: '2024-11-25', time: '11:30', status: 'confirmed' }
  ],
  patients: [
    { id: 1, name: 'Maria Silva', age: 45, lastVisit: '2024-10-15', status: 'active' },
    { id: 2, name: 'João Santos', age: 32, lastVisit: '2024-11-10', status: 'active' },
    { id: 3, name: 'Ana Costa', age: 28, lastVisit: '2024-11-18', status: 'active' }
  ]
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simulateApiCall = useCallback((data, delay = 500) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }, []);

  const getAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await simulateApiCall(mockData.appointments);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [simulateApiCall]);

  const createAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const newAppointment = {
        ...appointmentData,
        id: Date.now(),
        status: 'pending'
      };
      mockData.appointments.push(newAppointment);
      const result = await simulateApiCall(newAppointment);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [simulateApiCall]);

  const getPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await simulateApiCall(mockData.patients);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [simulateApiCall]);

  return {
    loading,
    error,
    getAppointments,
    createAppointment,
    getPatients
  };
};