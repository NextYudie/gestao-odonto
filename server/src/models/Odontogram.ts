import { executeQuery, executeQuerySingle } from '@/config/database';
import { Odontogram } from '@/types';

export class OdontogramModel {
  static async findByPatientId(patientId: number): Promise<Odontogram[]> {
    const query = `SELECT * FROM odontograms WHERE patient_id = ? ORDER BY created_at DESC`;
    return executeQuery<Odontogram>(query, [patientId]);
  }

  static async findById(id: number): Promise<Odontogram | null> {
    const query = `SELECT * FROM odontograms WHERE id = ?`;
    return executeQuerySingle<Odontogram>(query, [id]);
  }

  static async create(odontogramData: Omit<Odontogram, 'id' | 'created_at'>): Promise<number> {
    const query = `
      INSERT INTO odontograms ( 
        patient_id, 
        chart_data, 
        chart_type,
        created_at
      ) 
      VALUES (?, ?, ?, ?)
    `;
    
    const result: any = await executeQuery(query, [
      odontogramData.patient_id,
      odontogramData.chart_data ? JSON.stringify(odontogramData.chart_data) : null,
      odontogramData.chart_type,
      new Date().toISOString(),
    ]);
    
    return result[0].insertId;
  }

  static async update(id: number, odontogramData: Partial<Omit<Odontogram, 'id' | 'patient_id' | 'created_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(odontogramData).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        if (key === 'chart_data') {
            values.push(value ? JSON.stringify(value) : null);
        } else {
            values.push(value);
        }
    });

    if (fields.length === 0) return false;

    values.push(id);
    
    const query = `UPDATE odontograms SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await executeQuery(query, values);
    
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM odontograms WHERE id = ?`;
    const result: any = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }
}
