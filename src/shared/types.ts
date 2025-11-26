import z from "zod";

export const DriverProfileSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  cpf: z.string().min(11),
  birthDate: z.string(),
  vehicleType: z.enum(['truck', 'semi_truck', 'box_truck', 'flatbed']),
  vehicleBrand: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehiclePlate: z.string().min(7),
  cargoCapacity: z.number().positive(),
  cnhNumber: z.string().min(1),
  cnhCategory: z.string().min(1),
  cnhExpiry: z.string(),
  anttNumber: z.string().min(1),
});

export type DriverProfile = z.infer<typeof DriverProfileSchema>;

export const ShipperProfileSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  companyName: z.string().min(1),
  tradeName: z.string().optional(),
  cnpj: z.string().min(14),
  addressStreet: z.string().min(1),
  addressNumber: z.string().min(1),
  addressComplement: z.string().optional(),
  addressCity: z.string().min(1),
  addressState: z.string().length(2),
  addressZip: z.string().min(8),
});

export type ShipperProfile = z.infer<typeof ShipperProfileSchema>;

export const FreightSchema = z.object({
  cargoType: z.string().min(1),
  cargoDescription: z.string().min(1),
  weightTons: z.number().positive(),
  requiredVehicleType: z.enum(['truck', 'semi_truck', 'box_truck', 'flatbed']),
  pickupAddress: z.string().min(1),
  pickupCity: z.string().min(1),
  pickupState: z.string().length(2),
  pickupDate: z.string(),
  pickupContactName: z.string().min(1),
  pickupContactPhone: z.string().min(1),
  deliveryAddress: z.string().min(1),
  deliveryCity: z.string().min(1),
  deliveryState: z.string().length(2),
  deliveryDate: z.string(),
  deliveryContactName: z.string().min(1),
  deliveryContactPhone: z.string().min(1),
  freightValue: z.number().positive(),
  paymentTermDays: z.enum([30, 45, 60, 90]),
  distanceKm: z.number().optional(),
  notes: z.string().optional(),
});

export type Freight = z.infer<typeof FreightSchema>;
