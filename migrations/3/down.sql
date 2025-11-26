
DELETE FROM freights WHERE shipper_id IN (SELECT id FROM shippers WHERE user_profile_id = 100);
DELETE FROM drivers WHERE user_profile_id = 101;
DELETE FROM shippers WHERE user_profile_id = 100;
DELETE FROM user_profiles WHERE id IN (100, 101);
