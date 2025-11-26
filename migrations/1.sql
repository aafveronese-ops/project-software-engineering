
-- Users extension table to store profile type and status
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mocha_user_id TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK(user_type IN ('driver', 'shipper')),
  profile_status TEXT NOT NULL DEFAULT 'pending' CHECK(profile_status IN ('pending', 'active', 'suspended')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver-specific information
CREATE TABLE drivers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_profile_id INTEGER NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  vehicle_type TEXT NOT NULL CHECK(vehicle_type IN ('truck', 'semi_truck', 'box_truck', 'flatbed')),
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL UNIQUE,
  cargo_capacity REAL NOT NULL,
  cnh_number TEXT NOT NULL,
  cnh_category TEXT NOT NULL,
  cnh_expiry DATE NOT NULL,
  antt_number TEXT NOT NULL,
  pix_key TEXT,
  total_completed_freights INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
);

-- Shipper-specific information
CREATE TABLE shippers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_profile_id INTEGER NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT NOT NULL UNIQUE,
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip TEXT NOT NULL,
  credit_rating TEXT DEFAULT 'B' CHECK(credit_rating IN ('A+', 'A', 'B+', 'B', 'C')),
  total_posted_freights INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
);

-- Freight postings
CREATE TABLE freights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shipper_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'pending_confirmation', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled')),
  cargo_type TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  weight_tons REAL NOT NULL,
  required_vehicle_type TEXT NOT NULL,
  
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_state TEXT NOT NULL,
  pickup_date DATETIME NOT NULL,
  pickup_contact_name TEXT NOT NULL,
  pickup_contact_phone TEXT NOT NULL,
  
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_date DATETIME NOT NULL,
  delivery_contact_name TEXT NOT NULL,
  delivery_contact_phone TEXT NOT NULL,
  
  freight_value REAL NOT NULL,
  payment_term_days INTEGER NOT NULL CHECK(payment_term_days IN (30, 45, 60, 90)),
  distance_km REAL,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipper_id) REFERENCES shippers(id)
);

-- Freight assignments (when a driver accepts)
CREATE TABLE freight_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  freight_id INTEGER NOT NULL UNIQUE,
  driver_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK(status IN ('pending_confirmation', 'confirmed', 'rejected', 'cancelled')),
  confirmed_at TIMESTAMP,
  pickup_confirmed_at TIMESTAMP,
  delivery_confirmed_at TIMESTAMP,
  recipient_name TEXT,
  recipient_signature_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (freight_id) REFERENCES freights(id),
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE INDEX idx_freights_status ON freights(status);
CREATE INDEX idx_freights_shipper ON freights(shipper_id);
CREATE INDEX idx_freight_assignments_driver ON freight_assignments(driver_id);
CREATE INDEX idx_freight_assignments_freight ON freight_assignments(freight_id);
