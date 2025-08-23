-- Database Creation Script for Clinic Management System
-- Run this in MySQL as root user

-- Create database
CREATE DATABASE IF NOT EXISTS clinic_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create application user (optional but recommended)
CREATE USER IF NOT EXISTS 'clinic_user'@'localhost' IDENTIFIED BY 'clinic_2024_secure!';
CREATE USER IF NOT EXISTS 'clinic_user'@'%' IDENTIFIED BY 'clinic_2024_secure!';

-- Grant privileges
GRANT ALL PRIVILEGES ON clinic_management.* TO 'clinic_user'@'localhost';
GRANT ALL PRIVILEGES ON clinic_management.* TO 'clinic_user'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Use the database
USE clinic_management;

-- Show confirmation
SELECT 'Database clinic_management created successfully!' as message;