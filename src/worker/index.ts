import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// ============ Auth Routes ============

app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  // Get user profile
  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  return c.json({ 
    mochaUser: user,
    profile: profile || null
  });
});

app.get("/api/users/profile", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  // Get user profile
  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  let detailedProfile: any = {
    user_type: profile.user_type,
    full_name: profile.full_name,
    phone: profile.phone,
    email: user.email,
  };

  if (profile.user_type === 'driver') {
    const driverData = await c.env.DB.prepare(
      "SELECT * FROM drivers WHERE user_profile_id = ?"
    ).bind(profile.id).first();
    
    if (driverData) {
      detailedProfile.driver = driverData;
    }
  } else {
    const shipperData = await c.env.DB.prepare(
      "SELECT * FROM shippers WHERE user_profile_id = ?"
    ).bind(profile.id).first();
    
    if (shipperData) {
      detailedProfile.shipper = shipperData;
    }
  }

  return c.json({ profile: detailedProfile });
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// ============ Profile Routes ============

app.post("/api/profiles/driver", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();

  // Check if profile already exists
  const existing = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (existing) {
    return c.json({ error: "Profile already exists" }, 400);
  }

  // Create user profile
  const profileResult = await c.env.DB.prepare(
    `INSERT INTO user_profiles (mocha_user_id, user_type, profile_status, full_name, phone)
     VALUES (?, 'driver', 'active', ?, ?)`
  ).bind(user.id, body.fullName, body.phone).run();

  // Create driver profile
  await c.env.DB.prepare(
    `INSERT INTO drivers (
      user_profile_id, cpf, birth_date, vehicle_type, vehicle_brand, vehicle_model,
      vehicle_plate, cargo_capacity, cnh_number, cnh_category, cnh_expiry, antt_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    profileResult.meta.last_row_id,
    body.cpf,
    body.birthDate,
    body.vehicleType,
    body.vehicleBrand,
    body.vehicleModel,
    body.vehiclePlate,
    body.cargoCapacity,
    body.cnhNumber,
    body.cnhCategory,
    body.cnhExpiry,
    body.anttNumber
  ).run();

  return c.json({ success: true }, 201);
});

app.post("/api/profiles/shipper", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();

  // Check if profile already exists
  const existing = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (existing) {
    return c.json({ error: "Profile already exists" }, 400);
  }

  // Create user profile
  const profileResult = await c.env.DB.prepare(
    `INSERT INTO user_profiles (mocha_user_id, user_type, profile_status, full_name, phone)
     VALUES (?, 'shipper', 'active', ?, ?)`
  ).bind(user.id, body.fullName, body.phone).run();

  // Create shipper profile
  await c.env.DB.prepare(
    `INSERT INTO shippers (
      user_profile_id, company_name, trade_name, cnpj, 
      address_street, address_number, address_complement, address_city, address_state, address_zip
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    profileResult.meta.last_row_id,
    body.companyName,
    body.tradeName || null,
    body.cnpj,
    body.addressStreet,
    body.addressNumber,
    body.addressComplement || null,
    body.addressCity,
    body.addressState,
    body.addressZip
  ).run();

  return c.json({ success: true }, 201);
});

// ============ Freight Routes (Shipper) ============

app.post("/api/freights", async (c) => {
  const body = await c.req.json();

  // Demo mode - use demo shipper
  const profile = await c.env.DB.prepare(
    `SELECT id FROM shippers WHERE user_profile_id = 100`
  ).first();

  if (!profile) {
    return c.json({ error: "Demo shipper not found" }, 404);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO freights (
      shipper_id, cargo_type, cargo_description, weight_tons, required_vehicle_type,
      pickup_address, pickup_city, pickup_state, pickup_date, pickup_contact_name, pickup_contact_phone,
      delivery_address, delivery_city, delivery_state, delivery_date, delivery_contact_name, delivery_contact_phone,
      freight_value, payment_term_days, distance_km, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    profile.id,
    body.cargoType,
    body.cargoDescription,
    body.weightTons,
    body.requiredVehicleType,
    body.pickupAddress,
    body.pickupCity,
    body.pickupState,
    body.pickupDate,
    body.pickupContactName,
    body.pickupContactPhone,
    body.deliveryAddress,
    body.deliveryCity,
    body.deliveryState,
    body.deliveryDate,
    body.deliveryContactName,
    body.deliveryContactPhone,
    body.freightValue,
    body.paymentTermDays,
    body.distanceKm || null,
    body.notes || null
  ).run();

  return c.json({ id: result.meta.last_row_id }, 201);
});

app.get("/api/freights/shipper", async (c) => {
  // Demo mode - show all freights
  const { results } = await c.env.DB.prepare(
    `SELECT f.*, 
      CASE 
        WHEN fa.id IS NOT NULL THEN d.vehicle_plate
        ELSE NULL
      END as assigned_vehicle_plate
     FROM freights f
     LEFT JOIN freight_assignments fa ON f.id = fa.freight_id
     LEFT JOIN drivers d ON fa.driver_id = d.id
     ORDER BY f.created_at DESC`
  ).all();

  return c.json({ freights: results });
});

// ============ Freight Routes (Driver) ============

app.get("/api/freights/available", async (c) => {
  // Demo mode - show all available freights
  const { results } = await c.env.DB.prepare(
    `SELECT f.*, s.company_name, s.trade_name
     FROM freights f
     JOIN shippers s ON f.shipper_id = s.id
     WHERE f.status = 'available'
     ORDER BY f.pickup_date ASC`
  ).all();

  return c.json({ freights: results });
});

app.get("/api/freights/driver", async (c) => {
  // Demo mode - use demo driver
  const profile = await c.env.DB.prepare(
    `SELECT id FROM drivers WHERE user_profile_id = 101`
  ).first();

  if (!profile) {
    return c.json({ error: "Demo driver not found" }, 404);
  }

  const { results } = await c.env.DB.prepare(
    `SELECT f.*, fa.status as assignment_status, fa.pickup_confirmed_at, fa.delivery_confirmed_at,
      s.company_name, s.trade_name
     FROM freight_assignments fa
     JOIN freights f ON fa.freight_id = f.id
     JOIN shippers s ON f.shipper_id = s.id
     WHERE fa.driver_id = ?
     ORDER BY f.pickup_date DESC`
  ).bind(profile.id).all();

  return c.json({ freights: results });
});

app.get("/api/freights/:id", async (c) => {
  const freightId = c.req.param("id");
  
  const freight = await c.env.DB.prepare(
    `SELECT f.*, s.company_name, s.trade_name
     FROM freights f
     JOIN shippers s ON f.shipper_id = s.id
     WHERE f.id = ?`
  ).bind(freightId).first();

  if (!freight) {
    return c.json({ error: "Freight not found" }, 404);
  }

  return c.json({ freight });
});

app.delete("/api/freights/:id", async (c) => {
  const freightId = c.req.param("id");
  
  // Delete freight assignments first (foreign key constraint)
  await c.env.DB.prepare(
    "DELETE FROM freight_assignments WHERE freight_id = ?"
  ).bind(freightId).run();

  // Delete the freight
  const result = await c.env.DB.prepare(
    "DELETE FROM freights WHERE id = ?"
  ).bind(freightId).run();

  if (result.meta.changes === 0) {
    return c.json({ error: "Freight not found" }, 404);
  }

  return c.json({ success: true });
});

app.post("/api/freights/:id/accept", async (c) => {
  const freightId = c.req.param("id");
  
  // Demo mode - use demo driver
  const profile = await c.env.DB.prepare(
    `SELECT id FROM drivers WHERE user_profile_id = 101`
  ).first();

  if (!profile) {
    return c.json({ error: "Demo driver not found" }, 404);
  }

  // Check if freight is available
  const freight = await c.env.DB.prepare(
    "SELECT * FROM freights WHERE id = ? AND status = 'available'"
  ).bind(freightId).first();

  if (!freight) {
    return c.json({ error: "Freight not available" }, 404);
  }

  // Create assignment
  await c.env.DB.prepare(
    `INSERT INTO freight_assignments (freight_id, driver_id, status)
     VALUES (?, ?, 'pending_confirmation')`
  ).bind(freightId, profile.id).run();

  // Update freight status
  await c.env.DB.prepare(
    "UPDATE freights SET status = 'pending_confirmation', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(freightId).run();

  return c.json({ success: true });
});

app.post("/api/freights/:id/confirm-pickup", authMiddleware, async (c) => {
  const freightId = c.req.param("id");
  const user = c.get("user")!;
  
  const profile = await c.env.DB.prepare(
    `SELECT d.id FROM drivers d 
     JOIN user_profiles up ON d.user_profile_id = up.id 
     WHERE up.mocha_user_id = ?`
  ).bind(user.id).first();

  if (!profile) {
    return c.json({ error: "Driver profile not found" }, 404);
  }

  // Update assignment
  await c.env.DB.prepare(
    `UPDATE freight_assignments 
     SET pickup_confirmed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE freight_id = ? AND driver_id = ?`
  ).bind(freightId, profile.id).run();

  // Update freight status
  await c.env.DB.prepare(
    "UPDATE freights SET status = 'in_transit', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(freightId).run();

  return c.json({ success: true });
});

app.post("/api/freights/:id/confirm-delivery", authMiddleware, async (c) => {
  const freightId = c.req.param("id");
  const user = c.get("user")!;
  const body = await c.req.json();
  
  const profile = await c.env.DB.prepare(
    `SELECT d.id FROM drivers d 
     JOIN user_profiles up ON d.user_profile_id = up.id 
     WHERE up.mocha_user_id = ?`
  ).bind(user.id).first();

  if (!profile) {
    return c.json({ error: "Driver profile not found" }, 404);
  }

  // Update assignment
  await c.env.DB.prepare(
    `UPDATE freight_assignments 
     SET delivery_confirmed_at = CURRENT_TIMESTAMP, 
         recipient_name = ?,
         recipient_signature_data = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE freight_id = ? AND driver_id = ?`
  ).bind(body.recipientName, body.signatureData, freightId, profile.id).run();

  // Update freight status
  await c.env.DB.prepare(
    "UPDATE freights SET status = 'delivered', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(freightId).run();

  return c.json({ success: true });
});

// ============ Shipper confirmation routes ============

app.post("/api/freight-assignments/:freightId/confirm", authMiddleware, async (c) => {
  const freightId = c.req.param("freightId");
  const user = c.get("user")!;

  // Verify shipper owns this freight
  const freight = await c.env.DB.prepare(
    `SELECT f.id FROM freights f
     JOIN shippers s ON f.shipper_id = s.id
     JOIN user_profiles up ON s.user_profile_id = up.id
     WHERE f.id = ? AND up.mocha_user_id = ?`
  ).bind(freightId, user.id).first();

  if (!freight) {
    return c.json({ error: "Freight not found or unauthorized" }, 404);
  }

  // Confirm the assignment
  await c.env.DB.prepare(
    `UPDATE freight_assignments 
     SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE freight_id = ?`
  ).bind(freightId).run();

  // Update freight status
  await c.env.DB.prepare(
    "UPDATE freights SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(freightId).run();

  return c.json({ success: true });
});

app.post("/api/freight-assignments/:freightId/reject", authMiddleware, async (c) => {
  const freightId = c.req.param("freightId");
  const user = c.get("user")!;

  // Verify shipper owns this freight
  const freight = await c.env.DB.prepare(
    `SELECT f.id FROM freights f
     JOIN shippers s ON f.shipper_id = s.id
     JOIN user_profiles up ON s.user_profile_id = up.id
     WHERE f.id = ? AND up.mocha_user_id = ?`
  ).bind(freightId, user.id).first();

  if (!freight) {
    return c.json({ error: "Freight not found or unauthorized" }, 404);
  }

  // Reject the assignment
  await c.env.DB.prepare(
    `UPDATE freight_assignments 
     SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
     WHERE freight_id = ?`
  ).bind(freightId).run();

  // Make freight available again
  await c.env.DB.prepare(
    "UPDATE freights SET status = 'available', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(freightId).run();

  return c.json({ success: true });
});

export default app;
