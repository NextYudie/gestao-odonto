import { executeQuery, executeQuerySingle } from '@/config/database';
import { Appointment, PaginatedResponse } from '@/types';

interface AppointmentWithDetails extends Appointment {
  patient_name: string;
  doctor_name: string;
}

export class AppointmentModel {
  static async findById(id: number): Promise<AppointmentWithDetails | null> {
    const query = `
      SELECT 
        a.*,
        p.name as patient_name,
        u.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON a.doctor_id = u.id
      WHERE a.id = ?
    `;
    return executeQuerySingle<AppointmentWithDetails>(query, [id]);
  }

  static async findAll(
    limit = 20,
    offset = 0,
    doctorId?: number,
    patientId?: number,
    status?: string,
    date?: string
  ): Promise<PaginatedResponse<AppointmentWithDetails>> {
    // Fetch all appointments, as the JSON query parser is unreliable for WHERE clauses
    const allAppointments = await executeQuery<AppointmentWithDetails>('SELECT * FROM appointments');

    // Apply filters in JavaScript
    let filteredAppointments = allAppointments;

    if (doctorId) {
        filteredAppointments = filteredAppointments.filter(a => a.doctor_id == doctorId);
    }

    if (patientId) {
        filteredAppointments = filteredAppointments.filter(a => a.patient_id == patientId);
    }

    if (status) {
        filteredAppointments = filteredAppointments.filter(a => a.status === status);
    }

    if (date) {
        // Assuming appointment_date is a string in 'YYYY-MM-DD' format from the JSON db
        filteredAppointments = filteredAppointments.filter(a => a.appointment_date == date);
    }

    const total = filteredAppointments.length;

    // Apply pagination
    const paginatedData = filteredAppointments.slice(offset, offset + limit);

    return {
        data: paginatedData,
        pagination: {
            current_page: Math.floor(offset / limit) + 1,
            per_page: limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
  }

  static async create(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    // Check for conflicts
//     const conflictQuery = `
//   SELECT id FROM appointments
//   WHERE doctor_id = ?
//     AND DATE(appointment_date) = DATE(?)
//     AND TIME(appointment_time) = TIME(?)
//     AND status != 'cancelled'
// `;   
    
//     const conflict = await executeQuerySingle(conflictQuery, [
//       appointmentData.doctor_id,
//       appointmentData.appointment_date,
//       appointmentData.appointment_time
//     ]);
const allAppointments = await executeQuery<Appointment>(
  `SELECT * FROM appointments WHERE doctor_id = ? AND status != 'cancelled'`,
  [appointmentData.doctor_id]
);

const conflict = allAppointments.find(
  (a) =>
    a.appointment_date === appointmentData.appointment_date &&
    a.appointment_time === appointmentData.appointment_time
);

if (conflict) {
  const err: any = new Error('Horário já ocupado para este médico');
  err.code = 'CONFLICT';
  throw err;
}


    console.log('🧩 Checking conflict with:', {
    doctor_id: appointmentData.doctor_id,
    date: appointmentData.appointment_date,
    time: appointmentData.appointment_time
  });

  console.log('🧩 Conflict query result:', conflict);

    if (conflict && Object.keys(conflict).length > 0) {
  const err: any = new Error('Horário já ocupado para este médico');
  err.code = 'CONFLICT';
  throw err;
}

    const query = `
      INSERT INTO appointments (patient_id, doctor_id, specialty, appointment_date, appointment_time, duration, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result: any = await executeQuery(query, [
      appointmentData.patient_id,
      appointmentData.doctor_id,
      appointmentData.specialty,
      appointmentData.appointment_date,
      appointmentData.appointment_time,
      appointmentData.duration || 30,
      appointmentData.status || 'scheduled',
      appointmentData.notes || null
    ]);
    
    return result.insertId;
  }

  static async update(id: number, appointmentData: Partial<Appointment>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(appointmentData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    
    const query = `UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`;
    const result: any[] = await executeQuery(query, values);
    
    // The custom JSON parser returns [{ changes: 1 }] on success
    return result && result.length > 0 && result[0].changes > 0;
  }

  static async updateStatus(id: number, status: Appointment['status']): Promise<boolean> {
    const query = `UPDATE appointments SET status = ? WHERE id = ?`;
    const result: any = await executeQuery(query, [status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM appointments WHERE id = ?`;
    const result: any[] = await executeQuery(query, [id]);
    return result && result.length > 0 && result[0].changes > 0;
  }

  static async getTodayAppointments(doctorId?: number): Promise<AppointmentWithDetails[]> {
    let query = `
      SELECT 
        a.*,
        p.name as patient_name,
        u.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON a.doctor_id = u.id
      WHERE a.appointment_date = CURDATE()
    `;
    
    const params: any[] = [];

    if (doctorId) {
      query += ` AND a.doctor_id = ?`;
      params.push(doctorId);
    }

    query += ` ORDER BY a.appointment_time ASC`;
    
    return executeQuery<AppointmentWithDetails>(query, params);
  }

  static async getAppointmentStats(): Promise<{
    today: number;
    this_week: number;
    this_month: number;
    pending: number;
    confirmed: number;
    completed: number;
  }> {
    const queries = [
      `SELECT COUNT(*) as today FROM appointments WHERE appointment_date = CURDATE()`,
      `SELECT COUNT(*) as this_week FROM appointments WHERE WEEK(appointment_date) = WEEK(CURDATE()) AND YEAR(appointment_date) = YEAR(CURDATE())`,
      `SELECT COUNT(*) as this_month FROM appointments WHERE MONTH(appointment_date) = MONTH(CURDATE()) AND YEAR(appointment_date) = YEAR(CURDATE())`,
      `SELECT COUNT(*) as pending FROM appointments WHERE status = 'scheduled'`,
      `SELECT COUNT(*) as confirmed FROM appointments WHERE status = 'confirmed'`,
      `SELECT COUNT(*) as completed FROM appointments WHERE status = 'completed'`
    ];

    const results = await Promise.all(
      queries.map(query => executeQuerySingle<{[key: string]: number}>(query))
    );

    return {
      today: results[0]?.today || 0,
      this_week: results[1]?.this_week || 0,
      this_month: results[2]?.this_month || 0,
      pending: results[3]?.pending || 0,
      confirmed: results[4]?.confirmed || 0,
      completed: results[5]?.completed || 0
    };
  }

  static async getAvailableSlots(doctorId: number, date: string): Promise<string[]> {
    // Get existing appointments for the doctor on this date
    const query = `
      SELECT appointment_time, duration 
      FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ? AND status != 'cancelled'
      ORDER BY appointment_time
    `;
    
    const existingAppointments = await executeQuery<{appointment_time: string, duration: number}>(query, [doctorId, date]);
    
    // Generate all possible time slots (8:00 to 18:00, 30-minute intervals)
    const allSlots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
        allSlots.push(time);
      }
    }

    // Filter out occupied slots
    const occupiedSlots = new Set<string>();
    existingAppointments.forEach(apt => {
      const [hours, minutes] = apt.appointment_time.split(':').map(Number);
      const startTime = hours * 60 + minutes;
      const duration = apt.duration;
      
      // Mark all slots within the appointment duration as occupied
      for (let i = 0; i < duration; i += 30) {
        const slotTime = startTime + i;
        const slotHour = Math.floor(slotTime / 60);
        const slotMinute = slotTime % 60;
        const timeString = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}:00`;
        occupiedSlots.add(timeString);
      }
    });

    return allSlots.filter(slot => !occupiedSlots.has(slot));
  }
}