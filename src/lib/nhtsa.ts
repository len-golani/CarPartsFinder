const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api";

export interface VinDecodeResult {
  vin: string;
  make: string;
  model: string;
  modelYear: string;
  bodyClass: string;
  engineCylinders: string;
  engineDisplacement: string;
  engineHP: string;
  fuelType: string;
  transmissionStyle: string;
  driveType: string;
  plantCity: string;
  plantState: string;
  manufacturer: string;
  vehicleType: string;
  raw: Record<string, string>;
}

export async function decodeVin(vin: string): Promise<VinDecodeResult> {
  const cleanVin = vin.toUpperCase().trim();
  if (cleanVin.length < 11 || cleanVin.length > 17) {
    throw new Error("VIN must be between 11 and 17 characters");
  }

  const response = await fetch(
    `${NHTSA_BASE}/vehicles/DecodeVinValues/${cleanVin}?format=json`
  );

  if (!response.ok) {
    throw new Error(`NHTSA API error: ${response.status}`);
  }

  const data = await response.json();
  const r = data.Results?.[0];

  if (!r || r.ErrorCode !== "0") {
    throw new Error(r?.ErrorText || "Failed to decode VIN");
  }

  return {
    vin: r.VIN || cleanVin,
    make: r.Make || "Unknown",
    model: r.Model || "Unknown",
    modelYear: r.ModelYear || "Unknown",
    bodyClass: r.BodyClass || "N/A",
    engineCylinders: r.DisplacementCylinders || "N/A",
    engineDisplacement: r.DisplacementL ? `${r.DisplacementL}L` : "N/A",
    engineHP: r.EngineHP || "N/A",
    fuelType: r.FuelTypePrimary || "N/A",
    transmissionStyle: r.TransmissionStyle || "N/A",
    driveType: r.DriveType || "N/A",
    plantCity: r.PlantCity || "N/A",
    plantState: r.PlantState || "N/A",
    manufacturer: r.Manufacturer || "N/A",
    vehicleType: r.VehicleType || "N/A",
    raw: r,
  };
}

export async function getAllMakes(): Promise<string[]> {
  const response = await fetch(`${NHTSA_BASE}/vehicles/GetAllMakes?format=json`);
  if (!response.ok) throw new Error("Failed to fetch makes");
  const data = await response.json();
  return (data.Results || [])
    .map((m: { MakeName: string }) => m.MakeName)
    .sort();
}

export async function getModelsForMake(make: string): Promise<string[]> {
  const response = await fetch(
    `${NHTSA_BASE}/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`
  );
  if (!response.ok) throw new Error("Failed to fetch models");
  const data = await response.json();
  return [...new Set((data.Results || []).map((m: { Model_Name: string }) => m.Model_Name))].sort() as string[];
}

export async function getYearsForMakeModel(
  make: string,
  model: string
): Promise<string[]> {
  const response = await fetch(
    `${NHTSA_BASE}/vehicles/GetModelYearsForMakeAndModel/${encodeURIComponent(make)}/${encodeURIComponent(model)}?format=json`
  );
  if (!response.ok) throw new Error("Failed to fetch years");
  const data = await response.json();
  return (data.Results || []).map((r: { Year: string }) => r.Year).sort().reverse();
}
