export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  cro?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

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

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  birth_date: string;
  cpf: string;
  address?: string;
  emergency_contact?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Odontogram {
  id: number;
  patient_id: number;
  chart_data: any; // JSON type in DB, so 'any' for flexibility
  chart_type: 'inicial' | 'plano_tratamento';
  created_at: string; // Date in backend, string when fetched
}



export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  cro: string;
  specialty: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}


export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'amber';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AppointmentFormData {
  patient: string;
  specialty: string;
  date: string;
  time: string;
  observations: string;
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