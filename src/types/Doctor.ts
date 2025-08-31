export interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    crm: string;
    specialty: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
  }
  