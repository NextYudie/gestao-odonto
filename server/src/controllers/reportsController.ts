import { Request, Response } from 'express';
import { executeQuery } from '@/config/database';
import { Appointment } from '@/models/Appointment';
import { Transaction } from '@/models/Transaction';
import { Patient } from '@/models/Patient';

const getDateFromPeriod = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case '7days':
      return new Date(now.setDate(now.getDate() - 7));
    case '30days':
      return new Date(now.setMonth(now.getMonth() - 1));
    case '90days':
      return new Date(now.setMonth(now.getMonth() - 3));
    case '1year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1)); // Default to 30 days
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || '30days';
    const startDate = getDateFromPeriod(period);

    const allAppointments = await executeQuery<Appointment>('SELECT * FROM appointments');
    const allTransactions = await executeQuery<Transaction>('SELECT * FROM transactions');
    const allPatients = await executeQuery<Patient>('SELECT * FROM patients');

    const appointmentsInPeriod = allAppointments.filter(a => new Date(a.appointment_date) >= startDate);
    const transactionsInPeriod = allTransactions.filter(t => new Date(t.date) >= startDate);
    const patientsInPeriod = allPatients.filter(p => new Date(p.created_at) >= startDate);

    // 1. Appointments by Specialty
    const appointmentsBySpecialty = appointmentsInPeriod.reduce((acc, app) => {
      acc[app.specialty] = (acc[app.specialty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2. Financial Report
    const revenue = transactionsInPeriod
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactionsInPeriod
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const profit = revenue - expenses;

    // 3. Cancellation Rate
    const totalAppointments = appointmentsInPeriod.length;
    const cancelledAppointments = appointmentsInPeriod.filter(a => a.status === 'cancelled').length;
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;

    // 4. New Patients
    const newPatientsCount = patientsInPeriod.length;

    res.status(200).json({
      success: true,
      data: {
        appointmentsBySpecialty,
        financialReport: { revenue, expenses, profit },
        cancellationRate,
        newPatientsCount,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
