-- Create the new anamneses table
CREATE TABLE anamneses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  chief_complaint TEXT NULL,
  history_of_present_illness TEXT NULL,
  allergies JSON NULL,
  systemic_diseases JSON NULL,
  medications_in_use TEXT NULL,
  oral_hygiene_habits TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_patient_id (patient_id)
);

-- Remove the old medical_history column from the patients table
ALTER TABLE patients DROP COLUMN medical_history;
