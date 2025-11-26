
-- Insert a test freight for debugging
INSERT INTO freights (
  shipper_id, status, cargo_type, cargo_description, weight_tons, required_vehicle_type,
  pickup_address, pickup_city, pickup_state, pickup_date, pickup_contact_name, pickup_contact_phone,
  delivery_address, delivery_city, delivery_state, delivery_date, delivery_contact_name, delivery_contact_phone,
  freight_value, payment_term_days, distance_km
) 
SELECT 
  1, 'available', 'Grãos', 'Carga de soja para exportação', 25.5, 'truck',
  'Rod. BR-163 km 45', 'Campo Grande', 'MS', datetime('now', '+2 days'), 'João Silva', '(67) 98765-4321',
  'Porto de Santos', 'Santos', 'SP', datetime('now', '+5 days'), 'Maria Santos', '(13) 98888-7777',
  15000.00, 30, 1200.5
WHERE EXISTS (SELECT 1 FROM shippers LIMIT 1);
