-- SQLite Schema for Clinic Management System
PRAGMA foreign_keys = ON;

-- Users table (doctors/staff)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'doctor', 'nurse', 'receptionist')) DEFAULT 'doctor',
  cro TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at automatically
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  address TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at automatically
CREATE TRIGGER IF NOT EXISTS update_patients_timestamp 
AFTER UPDATE ON patients
BEGIN
  UPDATE patients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  specialty TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  status TEXT CHECK(status IN ('scheduled', 'confirmed', 'cancelled', 'completed')) DEFAULT 'scheduled',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger to update updated_at automatically
CREATE TRIGGER IF NOT EXISTS update_appointments_timestamp 
AFTER UPDATE ON appointments
BEGIN
  UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  appointment_id INTEGER,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  observations TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Trigger to update updated_at automatically
CREATE TRIGGER IF NOT EXISTS update_medical_records_timestamp 
AFTER UPDATE ON medical_records
BEGIN
  UPDATE medical_records SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_patients_cpf ON patients(cpf);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_medical_records_patient_date ON medical_records(patient_id, date);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_date ON medical_records(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_medical_records_appointment ON medical_records(appointment_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Insert default users (password is 'admin123')
INSERT OR IGNORE INTO users (id, name, email, password, role, cro) VALUES 
(1, 'Dr. Silva', 'admin@clinica.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.5g8kFDYMa', 'admin', '123456'),
(2, 'Dra. Santos', 'medico@clinica.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.5g8kFDYMa', 'doctor', '654321');

-- Insert sample patients
INSERT OR IGNORE INTO patients (id, name, email, phone, birth_date, cpf, address, status) VALUES 
(1, 'Maria Silva', 'maria@email.com', '(11) 99999-1111', '1979-05-15', '111.111.111-11', 'Rua das Flores, 123', 'active'),
(2, 'João Santos', 'joao@email.com', '(11) 99999-2222', '1992-08-22', '222.222.222-22', 'Av. Paulista, 456', 'active'),
(3, 'Ana Costa', 'ana@email.com', '(11) 99999-3333', '1996-12-03', '333.333.333-33', 'Rua Augusta, 789', 'active');

-- Insert sample appointments (using today's date + 1)
INSERT OR IGNORE INTO appointments (id, patient_id, doctor_id, specialty, appointment_date, appointment_time, status) VALUES 
(1, 1, 1, 'Cardiologia', DATE('now', '+1 day'), '09:00:00', 'confirmed'),
(2, 2, 2, 'Pediatria', DATE('now', '+1 day'), '10:15:00', 'scheduled'),
(3, 3, 1, 'Cardiologia', DATE('now', '+1 day'), '11:30:00', 'confirmed');