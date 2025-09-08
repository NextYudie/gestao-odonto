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
  