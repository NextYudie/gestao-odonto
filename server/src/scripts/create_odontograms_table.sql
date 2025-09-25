-- Create the odontograms table
CREATE TABLE odontograms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  chart_data JSON NULL,
  chart_type ENUM('inicial', 'plano_tratamento') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_patient_id (patient_id),
  INDEX idx_chart_type (chart_type)
);
