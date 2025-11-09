export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  cro?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  cro?: string;
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
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Anamnese {
  id: number;
  patient_id: number;
  chief_complaint?: string;
  history_of_present_illness?: string;
  family_disease_history?: string;
  allergies?: string[];
  systemic_diseases?: string[];
  medications_in_use?: string;
  oral_hygiene_habits?: string;
  created_at: Date;
}

export interface Odontogram {
  id: number;
  patient_id: number;
  chart_data: any; // JSON type in DB, so 'any' for flexibility
  chart_type: 'inicial' | 'plano_tratamento';
  created_at: Date;
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
  paid?: boolean;
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