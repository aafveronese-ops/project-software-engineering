
INSERT INTO user_profiles (id, mocha_user_id, user_type, profile_status, full_name, phone, created_at, updated_at)
VALUES 
  (100, 'demo_shipper', 'shipper', 'active', 'João Silva', '(42) 99999-1234', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (101, 'demo_driver', 'driver', 'active', 'Carlos Santos', '(42) 99999-5678', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO shippers (user_profile_id, company_name, trade_name, cnpj, address_street, address_number, address_city, address_state, address_zip, credit_rating, total_posted_freights, created_at, updated_at)
VALUES (100, 'Transportes Silva LTDA', 'Silva Transportes', '12.345.678/0001-90', 'Rua Principal', '123', 'Curitiba', 'PR', '80000-000', 'A', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO drivers (user_profile_id, cpf, birth_date, vehicle_type, vehicle_brand, vehicle_model, vehicle_plate, cargo_capacity, cnh_number, cnh_category, cnh_expiry, antt_number, total_completed_freights, created_at, updated_at)
VALUES (101, '123.456.789-00', '1985-05-15', 'truck', 'Scania', 'R450', 'ABC-1234', 25.0, '12345678900', 'E', '2027-12-31', 'ANTT123456', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO freights (shipper_id, status, cargo_type, cargo_description, weight_tons, required_vehicle_type, pickup_address, pickup_city, pickup_state, pickup_date, pickup_contact_name, pickup_contact_phone, delivery_address, delivery_city, delivery_state, delivery_date, delivery_contact_name, delivery_contact_phone, freight_value, payment_term_days, distance_km, notes, created_at, updated_at)
VALUES (
  (SELECT id FROM shippers WHERE user_profile_id = 100),
  'available',
  'Grãos',
  'Soja em grãos - carga completa para armazém',
  23.5,
  'truck',
  'Rodovia BR-277, KM 45',
  'Cascavel',
  'PR',
  '2025-12-01 08:00:00',
  'Pedro Costa',
  '(45) 99888-7766',
  'Avenida das Indústrias, 500',
  'Paranaguá',
  'PR',
  '2025-12-02 18:00:00',
  'Maria Oliveira',
  '(41) 99777-6655',
  8500.00,
  45,
  420.0,
  'Carga paletizada, necessário lona',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
