import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  RefreshCw,
  Car,
  Search,
  Check,
  AlertCircle,
  Settings,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const SUPERUSER_EMAIL = "gaziamiry@gmail.com";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "parts" | "vehicles" | "settings">("overview");

  // Mock stats for demo
  const stats = [
    { label: "Total Parts", value: "1,247", icon: Package, change: "+12%", color: "text-blue-400" },
    { label: "Active Users", value: "3,892", icon: Users, change: "+8%", color: "text-emerald-400" },
    { label: "VIN Decodes", value: "12,456", icon: Car, change: "+23%", color: "text-amber-400" },
    { label: "Search Queries", value: "45,231", icon: Search, change: "+15%", color: "text-purple-400" },
  ];

  const recentActivity = [
    { action: "VIN Decoded", detail: "1HGBH41JXMN109186 - Honda Accord 2021", time: "2 min ago" },
    { action: "Parts Updated", detail: "15 brake parts synced from NHTSA", time: "15 min ago" },
    { action: "New User", detail: "user@example.com registered", time: "1 hour ago" },
    { action: "Parts Search", detail: "\"ceramic brake pads\" - 47 results", time: "2 hours ago" },
    { action: "VIN Decoded", detail: "5YJSA1E14HF123456 - Tesla Model S 2017", time: "3 hours ago" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    await new Promise((r) => setTimeout(r, 1000));

    if (email === SUPERUSER_EMAIL && password === "123123**") {
      setIsAuthenticated(true);
      toast.success("Admin access granted");
    } else {
      toast.error("Invalid credentials");
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="text-center mb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                Admin Access
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with your admin credentials to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Sign In to Admin
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-400">Admin Access Only</p>
                  <p className="mt-1 text-muted-foreground">
                    This dashboard is restricted to authorized administrators only.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage parts, vehicles, and system settings</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border/60 bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <Icon className={cn("h-5 w-5", stat.color)} />
                    <span className="text-xs font-medium text-emerald-400">{stat.change}</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-border/50">
            {[
              { id: "overview" as const, label: "Overview", icon: TrendingUp },
              { id: "parts" as const, label: "Parts Data", icon: Package },
              { id: "vehicles" as const, label: "Vehicle Database", icon: Car },
              { id: "settings" as const, label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/20 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground">{item.action}</div>
                        <div className="text-xs text-muted-foreground truncate">{item.detail}</div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="text-base font-semibold text-foreground mb-4">System Status</h3>
                <div className="space-y-3">
                  {[
                    { name: "NHTSA VIN Decoder API", status: "operational", latency: "45ms" },
                    { name: "Parts Database", status: "operational", latency: "12ms" },
                    { name: "Search Index", status: "operational", latency: "8ms" },
                    { name: "User Authentication", status: "operational", latency: "23ms" },
                    { name: "Convex Backend", status: "operational", latency: "15ms" },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          service.status === "operational" ? "bg-emerald-400" : "bg-amber-400"
                        )} />
                        <span className="text-sm text-foreground">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{service.latency}</span>
                        <span className={cn(
                          "text-xs font-medium",
                          service.status === "operational" ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {service.status === "operational" ? "Operational" : "Degraded"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "parts" && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Parts Data Management</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage car parts data from real manufacturer sources
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <RefreshCw className="h-4 w-4" />
                  Sync Parts
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                {[
                  { label: "Total Parts", value: "1,247", icon: Package },
                  { label: "Categories", value: "8", icon: Database },
                  { label: "Last Sync", value: "2 min ago", icon: RefreshCw },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="rounded-lg bg-muted/20 p-4">
                      <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Database className="h-4 w-4" />
                  <span>Data Sources</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "NHTSA VPIC API", type: "Vehicle Data", status: "Connected" },
                    { name: "Manufacturer Catalogs", type: "Parts Specs", status: "Active" },
                    { name: "RockAuto Affiliate", type: "Pricing", status: "Active" },
                  ].map((source) => (
                    <div key={source.name} className="flex items-center justify-between rounded-lg bg-card p-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{source.name}</div>
                        <div className="text-xs text-muted-foreground">{source.type}</div>
                      </div>
                      <span className="text-xs font-medium text-emerald-400">{source.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "vehicles" && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Vehicle Database</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real vehicle data from NHTSA VPIC API
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Makes
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                {[
                  { label: "Vehicle Makes", value: "58,000+", icon: Car },
                  { label: "Models", value: "250,000+", icon: Database },
                  { label: "VIN Decodes", value: "12,456", icon: Search },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="rounded-lg bg-muted/20 p-4">
                      <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Car className="h-4 w-4" />
                  <span>API Endpoints</span>
                </div>
                <div className="space-y-2">
                  {[
                    { endpoint: "GET /vehicles/DecodeVinValues/:vin", description: "Decode VIN to vehicle info" },
                    { endpoint: "GET /vehicles/GetAllMakes", description: "Get all vehicle manufacturers" },
                    { endpoint: "GET /vehicles/GetModelsForMake/:make", description: "Get models for a make" },
                    { endpoint: "GET /vehicles/GetModelYearsForMakeAndModel/:make/:model", description: "Get years for make/model" },
                  ].map((endpoint) => (
                    <div key={endpoint.endpoint} className="rounded-lg bg-card p-3">
                      <code className="text-xs text-primary font-mono">{endpoint.endpoint}</code>
                      <div className="text-xs text-muted-foreground mt-1">{endpoint.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-6">System Settings</h3>
              <div className="space-y-6">
                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">VIN Decoder API</div>
                      <div className="text-xs text-muted-foreground">NHTSA VPIC API (Free, No Key Required)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Parts Data Sync</div>
                      <div className="text-xs text-muted-foreground">Auto-sync every 24 hours</div>
                    </div>
                    <select className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
                      <option>Every 24 hours</option>
                      <option>Every 12 hours</option>
                      <option>Every 6 hours</option>
                      <option>Manual only</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Search Index</div>
                      <div className="text-xs text-muted-foreground">Real-time indexing enabled</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-400">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Admin Account</div>
                      <div className="text-xs text-muted-foreground">{SUPERUSER_EMAIL}</div>
                    </div>
                    <span className="text-xs font-medium text-primary">Superuser</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
