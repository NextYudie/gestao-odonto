export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'revenue' | 'expense';
  amount: number;
  created_at?: string;
  updated_at?: string;
}
