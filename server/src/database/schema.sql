-- Create database
CREATE DATABASE IF NOT EXISTS clinic_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clinic_management;

-- Users table (doctors/staff)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'nurse', 'receptionist') DEFAULT 'doctor',
  cro VARCHAR(20) NULL,
  phone VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Patients table
CREATE TABLE patients (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_cpf (cpf),
  INDEX idx_name (name),
  INDEX idx_status (status)
);

-- Appointments table
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  specialty VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INT DEFAULT 30, -- duration in minutes
  status ENUM('scheduled', 'confirmed', 'cancelled', 'completed') DEFAULT 'scheduled',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_doctor_date (doctor_id, appointment_date),
  INDEX idx_patient_id (patient_id),
  INDEX idx_status (status)
);

-- Medical records table
CREATE TABLE medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT NULL,
  diagnosis TEXT NULL,
  treatment TEXT NULL,
  medications TEXT NULL,
  observations TEXT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  
  INDEX idx_patient_date (patient_id, date),
  INDEX idx_doctor_date (doctor_id, date),
  INDEX idx_appointment_id (appointment_id)
);

-- Notifications table
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created_at (created_at)
);

-- Insert default admin user
INSERT INTO users (name, email, password, role, cro) VALUES 
('Dr. Silva', 'admin@clinica.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.5g8kFDYMa', 'admin', '123456'),
('Dra. Santos', 'medico@clinica.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.5g8kFDYMa', 'doctor', '654321');

-- Insert sample patients
INSERT INTO patients (name, email, phone, birth_date, cpf, address, status) VALUES 
('Maria Silva', 'maria@email.com', '(11) 99999-1111', '1979-05-15', '111.111.111-11', 'Rua das Flores, 123', 'active'),
('João Santos', 'joao@email.com', '(11) 99999-2222', '1992-08-22', '222.222.222-22', 'Av. Paulista, 456', 'active'),
('Ana Costa', 'ana@email.com', '(11) 99999-3333', '1996-12-03', '333.333.333-33', 'Rua Augusta, 789', 'active');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, specialty, appointment_date, appointment_time, status) VALUES 
(1, 1, 'Cardiologia', '2024-11-25', '09:00:00', 'confirmed'),
(2, 2, 'Pediatria', '2024-11-25', '10:15:00', 'scheduled'),
(3, 1, 'Cardiologia', '2024-11-25', '11:30:00', 'confirmed');