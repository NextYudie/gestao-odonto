import { executeQuery, executeQuerySingle } from '@/config/database';
import { Anamnese } from '@/types';

const parseJsonString = (value: any) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value; // Return original string if parsing fails
    }
  }
  return value;
};

export class AnamneseModel {
  static async findByPatientId(patientId: number): Promise<Anamnese[]> {
    const query = `SELECT * FROM anamneses WHERE patient_id = ? ORDER BY created_at DESC`;
    const anamneses = await executeQuery<Anamnese>(query, [patientId]);
    return anamneses.map(a => ({
      ...a,
      allergies: parseJsonString(a.allergies),
      systemic_diseases: parseJsonString(a.systemic_diseases),
    }));
  }

  static async findById(id: number): Promise<Anamnese | null> {
    const query = `SELECT * FROM anamneses WHERE id = ?`;
    const anamnese = await executeQuerySingle<Anamnese>(query, [id]);
    if (anamnese) {
      return {
        ...anamnese,
        allergies: parseJsonString(anamnese.allergies),
        systemic_diseases: parseJsonString(anamnese.systemic_diseases),
      };
    }
    return null;
  }

  static async create(anamneseData: Omit<Anamnese, 'id' | 'created_at'>): Promise<number> {
    console.log('AnamneseModel.create - anamneseData:', anamneseData);
    const query = `
      INSERT INTO anamneses ( 
        patient_id, 
        chief_complaint, 
        history_of_present_illness, 
        allergies, 
        systemic_diseases, 
        medications_in_use, 
        oral_hygiene_habits,
        family_disease_history,
        created_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      anamneseData.patient_id,
      anamneseData.chief_complaint || null,
      anamneseData.history_of_present_illness || null,
      anamneseData.allergies ? JSON.stringify(anamneseData.allergies) : null,
      anamneseData.systemic_diseases ? JSON.stringify(anamneseData.systemic_diseases) : null,
      anamneseData.medications_in_use || null,
      anamneseData.oral_hygiene_habits || null,
      anamneseData.family_disease_history || null,
      new Date().toISOString(),
    ];
    console.log('AnamneseModel.create - params:', params);

    const result: any = await executeQuery(query, params);
    
    return result.insertId;
  }

  static async update(id: number, anamneseData: Partial<Omit<Anamnese, 'id' | 'patient_id' | 'created_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(anamneseData).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        if (key === 'allergies' || key === 'systemic_diseases') {
            values.push(value ? JSON.stringify(value) : null);
        } else {
            values.push(value);
        }
    });

    if (fields.length === 0) return false;

    values.push(id);
    
    const query = `UPDATE anamneses SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await executeQuery(query, values);
    
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM anamneses WHERE id = ?`;
    const result: any = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }
}
