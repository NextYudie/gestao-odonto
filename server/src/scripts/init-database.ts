import { createConnection, executeMutation, executeQuery } from '../config/database';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

async function initializeDatabase() {
  console.log('🔧 Initializing MySQL database...');

  try {
    await createConnection();
    console.log('✅ Connected to MySQL');

    // ------------------------------------------------------------------
    // Create tables
    // ------------------------------------------------------------------
    const createTables = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'doctor', 'nurse', 'receptionist') DEFAULT 'doctor',
        cro VARCHAR(20) NULL,
        phone VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS patients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NULL,
        phone VARCHAR(20) NULL,
        birth_date DATE NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        address TEXT NULL,
        emergency_contact VARCHAR(100) NULL,
        medical_history TEXT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS doctors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NULL,
        cro VARCHAR(20) UNIQUE NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        duration INT DEFAULT 30,
        status ENUM('scheduled', 'confirmed', 'cancelled', 'completed') DEFAULT 'scheduled',
        notes TEXT NULL,
        paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS anamneses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        chief_complaint TEXT NULL,
        history_of_present_illness TEXT NULL,
        allergies JSON NULL,
        systemic_diseases JSON NULL,
        medications_in_use TEXT NULL,
        oral_hygiene_habits TEXT NULL,
        family_disease_history TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS odontograms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        chart_data JSON NULL,
        chart_type ENUM('inicial', 'plano_tratamento') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS signatures (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        signature TEXT NULL,
        file_path VARCHAR(500) NULL,
        type ENUM('digital', 'pdf') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        date DATE NOT NULL,
        description VARCHAR(255) NOT NULL,
        type ENUM('revenue', 'expense') NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    // Execute each CREATE TABLE separately
    for (const statement of createTables.split(';').map(s => s.trim()).filter(Boolean)) {
      await executeMutation(statement);
    }
    console.log('✅ Tables created (or already exist)');

    // ------------------------------------------------------------------
    // Check if data already exists
    // ------------------------------------------------------------------
    const existingUsers = await executeQuery('SELECT id FROM users LIMIT 1');
    if (existingUsers.length > 0) {
      console.log('ℹ️  Seed data already exists, skipping...');
      console.log('✅ Database ready!');
      process.exit(0);
    }

    // ------------------------------------------------------------------
    // Seed default users
    // ------------------------------------------------------------------
    const adminHash = await bcrypt.hash('admin123', 12);
    const doctorHash = await bcrypt.hash('admin123', 12);

    await executeMutation(
      `INSERT INTO users (name, email, password, role, cro) VALUES (?, ?, ?, ?, ?)`,
      ['Dr. Silva', 'admin@clinic.com', adminHash, 'admin', '123456']
    );
    await executeMutation(
      `INSERT INTO users (name, email, password, role, cro) VALUES (?, ?, ?, ?, ?)`,
      ['Dra. Santos', 'medico@clinic.com', doctorHash, 'doctor', '654321']
    );
    console.log('✅ Default users created');

    // ------------------------------------------------------------------
    // Seed sample patients
    // ------------------------------------------------------------------
    await executeMutation(
      `INSERT INTO patients (name, email, phone, birth_date, cpf, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Maria Silva', 'maria@email.com', '(11) 99999-1111', '1979-05-15', '111.111.111-11', 'Rua das Flores, 123', 'active']
    );
    await executeMutation(
      `INSERT INTO patients (name, email, phone, birth_date, cpf, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['João Santos', 'joao@email.com', '(11) 99999-2222', '1992-08-22', '222.222.222-22', 'Av. Paulista, 456', 'active']
    );
    await executeMutation(
      `INSERT INTO patients (name, email, phone, birth_date, cpf, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Ana Costa', 'ana@email.com', '(11) 99999-3333', '1996-12-03', '333.333.333-33', 'Rua Augusta, 789', 'active']
    );
    console.log('✅ Sample patients created');

    // ------------------------------------------------------------------
    // Seed sample appointments (tomorrow)
    // ------------------------------------------------------------------
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];

    await executeMutation(
      `INSERT INTO appointments (patient_id, doctor_id, specialty, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [1, 1, 'Ortodontia', appointmentDate, '09:00:00', 'confirmed']
    );
    await executeMutation(
      `INSERT INTO appointments (patient_id, doctor_id, specialty, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [2, 2, 'Clínico Geral', appointmentDate, '10:15:00', 'scheduled']
    );
    await executeMutation(
      `INSERT INTO appointments (patient_id, doctor_id, specialty, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [3, 1, 'Endodontia', appointmentDate, '11:30:00', 'confirmed']
    );
    console.log('✅ Sample appointments created');

    console.log('\n🎉 Database initialized successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Demo credentials:');
    console.log('   admin@clinic.com  | admin123  (Admin)');
    console.log('   medico@clinic.com | admin123  (Doctor)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();