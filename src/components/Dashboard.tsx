import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import AppointmentsList from './AppointmentsList';
import StatsChart from './StatsChart';
import { useAppointments } from '../hooks/useAppointments';
import { usePatients } from '../hooks/usePatients';
import apiService from '../services/api';
import type { StatCard as StatCardType } from '../types';

const Dashboard = () => {
  const { todayAppointments, loading: appointmentsLoading } = useAppointments();
  const { patients, loading: patientsLoading } = usePatients();
  const [stats, setStats] = useState<StatCardType[]>([
    {
      title: 'Consultas Hoje',
      value: '0',
      icon: 'fas fa-calendar-check',
      color: 'blue'
    },
    {
      title: 'Pacientes Ativos',
      value: '0',
      icon: 'fas fa-user-injured',
      color: 'green'
    },
    {
      title: 'Total Prontuários',
      value: '0',
      icon: 'fas fa-file-medical',
      color: 'purple'
    },
    {
      title: 'Total Consultas',
      value: '0',
      icon: 'fas fa-calendar',
      color: 'yellow'
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsStats, patientsStats] = await Promise.all([
          apiService.getAppointmentsStats(),
          apiService.getPatientsStats()
        ]);

        if (appointmentsStats.success && patientsStats.success) {
          setStats([
            {
              title: 'Consultas Hoje',
              value: appointmentsStats.data?.today?.toString() || '0',
              icon: 'fas fa-calendar-check',
              color: 'blue'
            },
            {
              title: 'Pacientes Ativos',
              value: patientsStats.data?.active?.toString() || '0',
              icon: 'fas fa-user-injured',
              color: 'green'
            },
            {
              title: 'Total Pacientes',
              value: patientsStats.data?.total?.toString() || '0',
              icon: 'fas fa-users',
              color: 'purple'
            },
            {
              title: 'Total Consultas',
              value: appointmentsStats.data?.total?.toString() || '0',
              icon: 'fas fa-calendar',
              color: 'yellow'
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  // Transform appointments for AppointmentsList component
  const transformedAppointments = todayAppointments.map(appointment => ({
    id: appointment.id,
    patient: `${appointment.patient?.name || 'Paciente'} - ${appointment.specialty}`,
    time: `${appointment.appointment_time} - ${appointment.duration ? 
      new Date(new Date(`2000-01-01T${appointment.appointment_time}`).getTime() + (appointment.duration * 60000)).toTimeString().slice(0, 5) 
      : ''}`,
    status: appointment.status as 'confirmed' | 'pending' | 'cancelled'
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AppointmentsList appointments={transformedAppointments} />
        <StatsChart />
      </div>
    </div>
  );
};

export default Dashboard;