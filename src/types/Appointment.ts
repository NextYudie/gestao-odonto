import type { Patient } from './index';
import type { User } from './index';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  duration?: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  patient?: Patient;
  doctor?: User;
}
