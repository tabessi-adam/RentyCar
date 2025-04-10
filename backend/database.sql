-- Create the database
CREATE DATABASE IF NOT EXISTS rentycar;

-- Use the database
USE rentycar;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20),
  role ENUM('client', 'admin', 'agent') DEFAULT 'client',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create offices table first (no foreign key dependencies)
CREATE TABLE IF NOT EXISTS offices (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phoneNumber VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create agents table (depends on offices)
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20),
  officeId VARCHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (officeId) REFERENCES offices(id) ON DELETE CASCADE
);

-- Create vehicles table (depends on offices)
CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(36) PRIMARY KEY,
  status ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  fuelType ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID') NOT NULL,
  transmission ENUM('MANUAL', 'AUTOMATIC') NOT NULL,
  pricePerDay DECIMAL(10,2) NOT NULL,
  hasGPS BOOLEAN DEFAULT FALSE,
  hasBluetooth BOOLEAN DEFAULT FALSE,
  hasAirConditioning BOOLEAN DEFAULT FALSE,
  hasUSBCable BOOLEAN DEFAULT FALSE,
  officeId VARCHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (officeId) REFERENCES offices(id) ON DELETE CASCADE
);

-- Create reservations table (depends on clients and vehicles)
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(36) PRIMARY KEY,
  clientId VARCHAR(36) NOT NULL,
  vehicleId VARCHAR(36) NOT NULL,
  officeId VARCHAR(36) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED') DEFAULT 'PENDING',
  totalDays INT NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (officeId) REFERENCES offices(id) ON DELETE CASCADE
);

-- Create reviews table (depends on clients and vehicles)
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY,
  clientId VARCHAR(36) NOT NULL,
  vehicleId VARCHAR(36) NOT NULL,
  officeId VARCHAR(36) NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5 AND rating % 0.5 = 0),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (officeId) REFERENCES offices(id) ON DELETE CASCADE
);

-- Insert a default admin user (password: admin123)
INSERT INTO admins (id, name, email, password, phoneNumber) 
VALUES (
  UUID(), 
  'Admin User', 
  'admin@example.com', 
  '$2b$10$wXwrNj5Vp9lNAoJm2STvcOxmnrDU48DkEpjwX6XereUVu5ymxVtFO',
  '+1234567890'
);

-- Insert sample offices
INSERT INTO offices (id, name, address, phoneNumber) VALUES
(UUID(), 'Downtown Office', '123 Main St, Downtown', '+1234567891'),
(UUID(), 'Airport Office', '456 Airport Rd, Terminal 2', '+1234567892'),
(UUID(), 'Suburb Office', '789 Oak Ave, Suburbia', '+1234567893');

-- Insert sample agents (password: agent123)
INSERT INTO agents (id, name, email, password, phoneNumber, officeId)
SELECT 
  UUID(),
  'Downtown Agent',
  'downtown@rentycar.com',
  '$2b$10$wXwrNj5Vp9lNAoJm2STvcOxmnrDU48DkEpjwX6XereUVu5ymxVtFO',
  '+1234567894',
  id
FROM offices
WHERE name = 'Downtown Office';

-- Insert sample vehicles
INSERT INTO vehicles (id, status, brand, model, year, fuelType, transmission, pricePerDay, hasGPS, hasBluetooth, hasAirConditioning, hasUSBCable, officeId)
SELECT
  UUID(),
  'AVAILABLE',
  'Toyota',
  'Camry',
  2022,
  'PETROL',
  'AUTOMATIC',
  50.00,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  id
FROM offices
WHERE name = 'Downtown Office'; 