import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Search,
  Check,
  Copy,
  AlertCircle,
  Shield,
  Cpu,
  Fuel,
  Wrench,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

interface VinDecodeResult {
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
  raw?: Record<string, string>;
}

export default function VinDecoderPage() {
  const [vin, setVin] = useState("");
  const [result, setResult] = useState<VinDecodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const decodeVin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim()) {
      setError("Please enter a VIN");
      return;
    }

    const cleanVin = vin.toUpperCase().trim();
    if (cleanVin.length < 11 || cleanVin.length > 17) {
      setError("VIN must be between 11 and 17 characters");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Call NHTSA API directly (free, no key required)
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${cleanVin}?format=json`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const r = data.Results?.[0];

      if (!r || r.ErrorCode !== "0") {
        throw new Error(r?.ErrorText || "Failed to decode VIN");
      }

      const decodeResult: VinDecodeResult = {
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

      setResult(decodeResult);
      toast.success("VIN decoded successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode VIN");
      toast.error("VIN decode failed");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = Object.entries(result)
      .filter(([k]) => k !== "raw")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const specRows = result
    ? [
        { icon: Car, label: "Make", value: result.make },
        { icon: Car, label: "Model", value: result.model },
        { icon: Car, label: "Model Year", value: result.modelYear },
        { icon: Car, label: "Vehicle Type", value: result.vehicleType },
        { icon: Car, label: "Body Style", value: result.bodyClass },
        { icon: Shield, label: "Manufacturer", value: result.manufacturer },
        { icon: Cpu, label: "Engine Cylinders", value: result.engineCylinders },
        { icon: Cpu, label: "Engine Displacement", value: result.engineDisplacement },
        { icon: Wrench, label: "Engine HP", value: result.engineHP },
        { icon: Fuel, label: "Fuel Type", value: result.fuelType },
        { icon: Wrench, label: "Transmission", value: result.transmissionStyle },
        { icon: Wrench, label: "Drive Type", value: result.driveType },
        { icon: MapPin, label: "Assembly Plant", value: `${result.plantCity}, ${result.plantState}` },
      ]
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              VIN Decoder
            </h1>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Decode any Vehicle Identification Number to get detailed vehicle specifications.
              Powered by the official NHTSA database.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={decodeVin} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => {
                    setVin(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="Enter 17-character VIN"
                  maxLength={17}
                  className="w-full rounded-xl border border-border bg-card pl-12 pr-4 py-4 text-lg font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !vin.trim()}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span className="hidden sm:inline">Decode</span>
                  </>
                )}
              </button>
            </div>

            {/* Example VINs */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              {[
                { vin: "1HGBH41JXMN109186", label: "Honda Civic" },
                { vin: "5YJSA1E14HF123456", label: "Tesla Model S" },
                { vin: "1FTFW1ET5EKE12345", label: "Ford F-150" },
              ].map((example) => (
                <button
                  key={example.vin}
                  type="button"
                  onClick={() => {
                    setVin(example.vin);
                    setError("");
                  }}
                  className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {example.vin} <span className="ml-1 text-muted-foreground">({example.label})</span>
                </button>
              ))}
            </div>
          </form>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="text-sm text-destructive">{error}</div>
            </motion.div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/60 bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span className="text-base font-semibold text-foreground">VIN Decoded Successfully</span>
                  </div>
                  <div className="mt-1 font-mono text-sm text-muted-foreground">{result.vin}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    {showRaw ? "Summary" : "Raw Data"}
                  </button>
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Vehicle Summary */}
              <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {result.modelYear} {result.make} {result.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.bodyClass} • {result.fuelType} • {result.transmissionStyle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {!showRaw ? (
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Vehicle Specifications</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {specRows.map((spec) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={spec.label}
                          className="flex items-center gap-3 rounded-lg bg-muted/20 p-3"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs text-muted-foreground">{spec.label}</div>
                            <div className="text-sm font-medium text-foreground truncate">
                              {spec.value}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Raw NHTSA Response</h3>
                  <div className="rounded-lg bg-muted/20 p-4 overflow-auto max-h-96">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(result.raw, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Info Box */}
          <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">About VIN Decoding</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
              <div className="space-y-3">
                <p>
                  A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle.
                  It contains information about the vehicle's manufacturer, model, year, and production details.
                </p>
                <p>
                  This decoder uses the official NHTSA (National Highway Traffic Safety Administration) database,
                  which is the authoritative source for VIN data in the United States.
                </p>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/20 p-3">
                  <div className="font-medium text-foreground mb-1">Free & Official</div>
                  <div className="text-xs">
                    Powered by the NHTSA vPIC API - completely free, no API key required.
                  </div>
                </div>
                <div className="rounded-lg bg-muted/20 p-3">
                  <div className="font-medium text-foreground mb-1">Real-Time Data</div>
                  <div className="text-xs">
                    Data is fetched directly from the NHTSA database in real-time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
