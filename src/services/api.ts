import type { Appointment, Patient, User } from "../types";

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
  async getPatients(): Promise<ApiResponse<Patient[]>> {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<Patient[]>>(response);
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
}

export const apiService = new ApiService();
export default apiService;
