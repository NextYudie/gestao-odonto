import type { Anamnese, Patient, User, Doctor, PaginatedResponse, Odontogram } from "../types";
import type { Appointment } from "../types/Appointment";

const API_BASE_URL = "http://localhost:3001/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(errorData.message || "Erro na requisição");
    }

    return response.json();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  async getMe(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<User>>(response);
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    return this.handleResponse<ApiResponse<{ token: string }>>(response);
  }

  // Patients
  async getPatients(): Promise<ApiResponse<PaginatedResponse<Patient>>> {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<PaginatedResponse<Patient>>>(response);
  }

  async getPatient(id: number): Promise<ApiResponse<Patient>> {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Patient>>(response);
  }

  async createPatient(
    patient: Omit<Patient, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Patient>> {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patient),
    });

    return this.handleResponse<ApiResponse<Patient>>(response);
  }

  async updatePatient(
    id: number,
    patient: Partial<Patient>
  ): Promise<ApiResponse<Patient>> {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patient),
    });

    return this.handleResponse<ApiResponse<Patient>>(response);
  }

  async deletePatient(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  async getPatientsStats(): Promise<
    ApiResponse<{ total: number; active: number; inactive: number }>
  > {
    const response = await fetch(`${API_BASE_URL}/patients/stats`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<
      ApiResponse<{ total: number; active: number; inactive: number }>
    >(response);
  }

  // Appointments
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Appointment[]>>(response);
  }

  async getTodayAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await fetch(`${API_BASE_URL}/appointments/today`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Appointment[]>>(response);
  }

  async getAppointment(id: number): Promise<ApiResponse<Appointment>> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Appointment>>(response);
  }

  async createAppointment(
    appointment: Omit<Appointment, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Appointment>> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(appointment),
    });

    return this.handleResponse<ApiResponse<Appointment>>(response);
  }

  async updateAppointment(
    id: number,
    appointment: Partial<Appointment>
  ): Promise<ApiResponse<Appointment>> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(appointment),
    });

    return this.handleResponse<ApiResponse<Appointment>>(response);
  }

  async deleteAppointment(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  async getAppointmentsStats(): Promise<
    ApiResponse<{
      total: number;
      today: number;
      confirmed: number;
      cancelled: number;
    }>
  > {
    const response = await fetch(`${API_BASE_URL}/appointments/stats`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<
      ApiResponse<{
        total: number;
        today: number;
        confirmed: number;
        cancelled: number;
      }>
    >(response);
  }

  async getAvailableSlots(
    doctorId: number,
    date: string
  ): Promise<ApiResponse<string[]>> {
    const response = await fetch(
      `${API_BASE_URL}/appointments/available-slots/${doctorId}/${date}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<ApiResponse<string[]>>(response);
  }

  // Doctors
  async getDoctors(page = 1, limit = 20, search = ""): Promise<ApiResponse<PaginatedResponse<Doctor>>> {
    const response = await fetch(`${API_BASE_URL}/doctors?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<PaginatedResponse<Doctor>>>(response);
  }

  async getDoctor(id: number): Promise<ApiResponse<Doctor>> {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Doctor>>(response);
  }

  async createDoctor(
    doctor: Omit<Doctor, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Doctor>> {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(doctor),
    });

    return this.handleResponse<ApiResponse<Doctor>>(response);
  }

  async updateDoctor(
    id: number,
    doctor: Partial<Doctor>
  ): Promise<ApiResponse<Doctor>> {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(doctor),
    });

    return this.handleResponse<ApiResponse<Doctor>>(response);
  }

  async deleteDoctor(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // Anamneses
  async getAnamnesesByPatient(patientId: number): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/anamneses/patient/${patientId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Anamnese[]>>(response);
  }

  async createAnamnese(anamnese: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/anamneses`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(anamnese),
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  // Odontograms
  async getOdontogramsByPatient(patientId: number): Promise<ApiResponse<Odontogram[]>> {
    const response = await fetch(`${API_BASE_URL}/odontograms/patient/${patientId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Odontogram[]>>(response);
  }

  async createOdontogram(odontogram: Omit<Odontogram, 'id' | 'created_at'>): Promise<ApiResponse<Odontogram>> {
    const response = await fetch(`${API_BASE_URL}/odontograms`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(odontogram),
    });

    return this.handleResponse<ApiResponse<Odontogram>>(response);
  }

  async updateOdontogram(id: number, odontogram: Partial<Omit<Odontogram, 'id' | 'patient_id' | 'created_at'>>): Promise<ApiResponse<Odontogram>> {
    const response = await fetch(`${API_BASE_URL}/odontograms/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(odontogram),
    });

    return this.handleResponse<ApiResponse<Odontogram>>(response);
  }

  async deleteOdontogram(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/odontograms/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // Signatures
  async uploadSignature(patientId: number, signatureData: string | File, type: 'digital' | 'pdf'): Promise<ApiResponse> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    let body: BodyInit;

    if (type === 'digital') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({ patientId, signature: signatureData, type });
    } else { // pdf
      const formData = new FormData();
      formData.append('patientId', patientId.toString());
      formData.append('type', type);
      formData.append('signature', signatureData as File);
      body = formData;
    }

    const response = await fetch(`${API_BASE_URL}/signatures/upload`, {
      method: 'POST',
      headers,
      body,
    });

    return this.handleResponse<ApiResponse>(response);
  }

  async getSignaturesByPatient(patientId: number): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/signatures/patient/${patientId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<any[]>>(response);
  }

  // Financial
  async getFinancialSummary(): Promise<ApiResponse<{ monthlyRevenue: number; monthlyExpenses: number; monthlyProfit: number; }>> {
    const response = await fetch(`${API_BASE_URL}/transactions/summary`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTransactions(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createTransaction(transaction: { date: string; description: string; type: 'revenue' | 'expense'; amount: number }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transaction),
    });
    return this.handleResponse(response);
  }

  // Reports
  async getReports(period: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/reports?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
export default apiService;
