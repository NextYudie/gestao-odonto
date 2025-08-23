export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  crm?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  crm?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  birth_date: Date;
  cpf: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  specialty: string;
  appointment_date: Date;
  appointment_time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  observations?: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
  expires_in: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}