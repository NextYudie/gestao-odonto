import { executeQuery, executeQuerySingle } from '@/config/database';
import { Patient, PaginatedResponse } from '@/types';

export class PatientModel {
  static async findById(id: number): Promise<Patient | null> {
    const query = `SELECT * FROM patients WHERE id = ?`;
    return executeQuerySingle<Patient>(query, [id]);
  }

  static async findByCpf(cpf: string): Promise<Patient | null> {
    const query = `SELECT * FROM patients WHERE cpf = ?`;
    return executeQuerySingle<Patient>(query, [cpf]);
  }

  static async findAll(
    limit = 20, 
    offset = 0, 
    search?: string
  ): Promise<PaginatedResponse<Patient>> {
    let query = `
      SELECT * FROM patients 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (name LIKE ? OR cpf LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await executeQuerySingle<{total: number}>(countQuery, params);
    const total = countResult?.total || 0;

    // Get paginated data
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const data = await executeQuery<Patient>(query, params);

    return {
      data,
      pagination: {
        current_page: Math.floor(offset / limit) + 1,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  static async create(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const query = `
      INSERT INTO patients (name, email, phone, birth_date, cpf, address, emergency_contact, medical_history, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result: any = await executeQuery(query, [
      patientData.name,
      patientData.email || null,
      patientData.phone || null,
      patientData.birth_date,
      patientData.cpf,
      patientData.address || null,
      patientData.emergency_contact || null,
      patientData.medical_history || null,
      patientData.status || 'active'
    ]);
    
    return result.insertId;
  }

  static async update(id: number, patientData: Partial<Patient>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(patientData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    
    const query = `UPDATE patients SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await executeQuery(query, values);
    
    return result.length > 0 && result[0].changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM patients WHERE id = ?`;
    const result: any = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  static async updateStatus(id: number, status: 'active' | 'inactive'): Promise<boolean> {
    const query = `UPDATE patients SET status = ? WHERE id = ?`;
    const result: any = await executeQuery(query, [status, id]);
    return result.affectedRows > 0;
  }

  static async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM patients WHERE status = 'active'`;
    const result = await executeQuerySingle<{count: number}>(query);
    return result?.count || 0;
  }

  static async getPatientStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    new_this_month: number;
  }> {
    const queries = [
      `SELECT COUNT(*) as total FROM patients`,
      `SELECT COUNT(*) as active FROM patients WHERE status = 'active'`,
      `SELECT COUNT(*) as inactive FROM patients WHERE status = 'inactive'`,
      `SELECT COUNT(*) as new_this_month FROM patients WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
    ];

    const [totalResult, activeResult, inactiveResult, newThisMonthResult] = await Promise.all(
      queries.map(query => executeQuerySingle<{[key: string]: number}>(query))
    );

    return {
      total: totalResult?.total || 0,
      active: activeResult?.active || 0,
      inactive: inactiveResult?.inactive || 0,
      new_this_month: newThisMonthResult?.new_this_month || 0
    };
  }
}