import { action } from "./_generated/server";
import { v } from "convex/values";

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api";

// Helper to fetch from NHTSA API
async function fetchNhtsa(endpoint: string): Promise<unknown> {
  const url = `${NHTSA_BASE}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NHTSA API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Decode a VIN number
export const decodeVin = action({
  args: { vin: v.string() },
  handler: async (_ctx, args) => {
    const vin = args.vin.toUpperCase().trim();
    if (vin.length < 11 || vin.length > 17) {
      throw new Error("VIN must be between 11 and 17 characters");
    }

    const data = await fetchNhtsa(
      `/vehicles/DecodeVinValues/${vin}?format=json`
    ) as {
      Results: Array<Record<string, string>>;
    };

    const result = data.Results?.[0];
    if (!result) {
      throw new Error("No decode result returned from NHTSA");
    }

    return {
      vin: result.VIN || vin,
      make: result.Make || "",
      model: result.Model || "",
      modelYear: result.ModelYear || "",
      bodyClass: result.BodyClass || "",
      engineCylinders: result.DisplacementCylinders || "",
      engineDisplacement: result.DisplacementL || "",
      engineHP: result.EngineHP || "",
      fuelType: result.FuelTypePrimary || "",
      transmissionStyle: result.TransmissionStyle || "",
      driveType: result.DriveType || "",
      plantCity: result.PlantCity || "",
      plantState: result.PlantState || "",
      manufacturer: result.Manufacturer || "",
      vehicleType: result.VehicleType || "",
      errorCodes: result.ErrorCode || "",
      errorText: result.ErrorText || "",
      raw: result,
    };
  },
});

// Get all vehicle makes
export const getAllMakes = action({
  args: {},
  handler: async () => {
    const data = await fetchNhtsa("/vehicles/GetAllMakes?format=json") as {
      Results: Array<{
        MakeId: number;
        MakeName: string;
        VehicleTypeName: string;
      }>;
    };

    return (data.Results || []).map((m) => ({
      makeId: String(m.MakeId),
      makeName: m.MakeName,
      vehicleType: m.VehicleTypeName || "",
    }));
  },
});

// Get models for a specific make
export const getModelsForMake = action({
  args: { makeName: v.string() },
  handler: async (_ctx, args) => {
    const data = await fetchNhtsa(
      `/vehicles/GetModelsForMake/${encodeURIComponent(args.makeName)}?format=json`
    ) as {
      Results: Array<{
        Make_ID: number;
        Make_Name: string;
        Model_ID: number;
        Model_Name: string;
      }>;
    };

    return (data.Results || []).map((m) => ({
      makeId: String(m.Make_ID),
      makeName: m.Make_Name,
      modelId: String(m.Model_ID),
      modelName: m.Model_Name,
    }));
  },
});

// Get years for a specific make and model
export const getYearsForMakeModel = action({
  args: {
    makeName: v.string(),
    modelName: v.string(),
  },
  handler: async (_ctx, args) => {
    const data = await fetchNhtsa(
      `/vehicles/GetModelYearsForMakeAndModel/${encodeURIComponent(args.makeName)}/${encodeURIComponent(args.modelName)}?format=json`
    ) as {
      Results: Array<{
        Make_ID: number;
        Make_Name: string;
        Model_ID: number;
        Model_Name: string;
        Model_Year_ID: number;
        Year: string;
      }>;
    };

    return (data.Results || []).map((r) => r.Year).sort().reverse();
  },
});

// Get vehicle specifications by make, model, and year
export const getVehicleSpecs = action({
  args: {
    make: v.string(),
    model: v.string(),
    modelYear: v.string(),
  },
  handler: async (_ctx, args) => {
    const data = await fetchNhtsa(
      `/vehicles/GetModelsForMakeAndYear/${encodeURIComponent(args.make)}/${encodeURIComponent(args.model)}/${args.modelYear}?format=json`
    ) as {
      Results: Array<Record<string, string>>;
    };

    return data.Results || [];
  },
});
