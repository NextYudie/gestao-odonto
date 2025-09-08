import { createConnection, executeQuery } from '../config/database';
import bcrypt from 'bcryptjs';

function initializeDatabase() {
  console.log('🔧 Initializing JSON database...');
  
  try {
    const db = createConnection();
    
    // Create default admin user
    const adminPasswordHash = bcrypt.hashSync('admin123', 12);
    const doctorPasswordHash = bcrypt.hashSync('admin123', 12);
    
    // Add default users
    db.users.push({
      id: 1,
      name: 'Dr. Silva',
      email: 'admin@clinica.com',
      password: adminPasswordHash,
      role: 'admin',
      cro: '123456',
      phone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    db.users.push({
      id: 2,
      name: 'Dra. Santos',
      email: 'medico@clinica.com',
      password: doctorPasswordHash,
      role: 'doctor',
      cro: '654321',
      phone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Add sample patients
    db.patients.push({
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 99999-1111',
      birth_date: '1979-05-15',
      cpf: '111.111.111-11',
      address: 'Rua das Flores, 123',
      emergency_contact: null,
      medical_history: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    db.patients.push({
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 99999-2222',
      birth_date: '1992-08-22',
      cpf: '222.222.222-22',
      address: 'Av. Paulista, 456',
      emergency_contact: null,
      medical_history: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    db.patients.push({
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 99999-3333',
      birth_date: '1996-12-03',
      cpf: '333.333.333-33',
      address: 'Rua Augusta, 789',
      emergency_contact: null,
      medical_history: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Add sample appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];
    
    db.appointments.push({
      id: 1,
      patient_id: 1,
      doctor_id: 1,
      specialty: 'Cardiologia',
      appointment_date: appointmentDate,
      appointment_time: '09:00:00',
      duration: 30,
      status: 'confirmed',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    db.appointments.push({
      id: 2,
      patient_id: 2,
      doctor_id: 2,
      specialty: 'Pediatria',
      appointment_date: appointmentDate,
      appointment_time: '10:15:00',
      duration: 30,
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    db.appointments.push({
      id: 3,
      patient_id: 3,
      doctor_id: 1,
      specialty: 'Cardiologia',
      appointment_date: appointmentDate,
      appointment_time: '11:30:00',
      duration: 30,
      status: 'confirmed',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Save the database manually
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, '../../database/clinic.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    console.log('✅ Database initialized successfully!');
    console.log('👤 Default users created:');
    console.log('   - admin@clinica.com (admin) - password: admin123');
    console.log('   - medico@clinica.com (doctor) - password: admin123');
    console.log('📊 Sample data inserted');
    console.log(`📁 Database saved to: database/clinic.json`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();