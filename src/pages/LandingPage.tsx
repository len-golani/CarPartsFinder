import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Zap,
  Star,
  Wrench,
  Cpu,
  MoveVertical,
  Wind,
  Lightbulb,
  Cog,
  ThermometerSnowflake,
  ArrowRight,
  Car,
  Database,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const categories = [
  { name: "Brakes", icon: Shield, count: "45+ parts", color: "from-red-500/20 to-orange-500/20" },
  { name: "Engine", icon: Cpu, count: "62+ parts", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Suspension", icon: MoveVertical, count: "38+ parts", color: "from-purple-500/20 to-pink-500/20" },
  { name: "Exhaust", icon: Wind, count: "29+ parts", color: "from-amber-500/20 to-yellow-500/20" },
  { name: "Lighting", icon: Lightbulb, count: "54+ parts", color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Electrical", icon: Wrench, count: "41+ parts", color: "from-sky-500/20 to-blue-500/20" },
  { name: "Transmission", icon: Cog, count: "33+ parts", color: "from-rose-500/20 to-red-500/20" },
  { name: "Cooling", icon: ThermometerSnowflake, count: "27+ parts", color: "from-cyan-500/20 to-blue-500/20" },
];

const vehicles = [
  { make: "Honda", models: ["Civic", "Accord", "CR-V"] },
  { make: "Toyota", models: ["Camry", "Corolla", "RAV4"] },
  { make: "Ford", models: ["F-150", "Mustang", "Explorer"] },
  { make: "Chevrolet", models: ["Silverado", "Camaro", "Cruze"] },
  { make: "Subaru", models: ["WRX", "STI", "BRZ"] },
  { make: "Mazda", models: ["Mazda3", "Mazda6", "CX-5"] },
];

const stats = [
  { value: "10,000+", label: "Real parts from manufacturers" },
  { value: "500+", label: "Trusted brands" },
  { value: "58,000+", label: "Vehicle makes in database" },
  { value: "100%", label: "Free API integration" },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Honda Civic Owner",
    text: "The VIN decoder told me exactly what parts fit my car. No more guessing or wrong orders!",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "DIY Mechanic",
    text: "Real manufacturer specs and prices. I compared parts across categories in seconds.",
    rating: 5,
  },
  {
    name: "Jake R.",
    role: "Shop Owner",
    text: "We use this for all our customer builds. The NHTSA data is incredibly reliable.",
    rating: 5,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState("");
  const [vinInput, setVinInput] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate("/catalog");
    }
  };

  const handleVinDecode = (e: React.FormEvent) => {
    e.preventDefault();
    if (vinInput.trim()) {
      navigate(`/vin-decoder?vin=${encodeURIComponent(vinInput.trim())}`);
    } else {
      navigate("/vin-decoder");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pt-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Globe className="h-3.5 w-3.5" />
              Powered by NHTSA - Real Vehicle Data
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Find the{" "}
              <span className="text-gradient">right part</span>
              <br />
              for your vehicle
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
            >
              Real parts data from manufacturer catalogs. Decode your VIN to find exact-fit parts.
              No more guessing — get verified compatibility and real pricing.
            </motion.p>

            {/* VIN Decoder Quick Access */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleVinDecode}
              className="mx-auto mt-8 max-w-xl"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 glow-blue">
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <Car className="h-5 w-5 text-primary shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your VIN (17 characters)"
                    value={vinInput}
                    onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                    maxLength={17}
                    className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Decode VIN
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Free VIN decoder powered by NHTSA official database
              </p>
            </motion.form>

            {/* General Search */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleQuickSearch}
              className="mx-auto mt-4 max-w-xl"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/50 p-2">
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search parts... (e.g. brake pads, oil filter)"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-muted px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  Search Parts
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Popular:</span>
                {["Brake Pads", "Oil Filter", "LED Headlights", "Spark Plugs"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuickSearch(term);
                      navigate(`/catalog?q=${encodeURIComponent(term)}`);
                    }}
                    className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vehicle Compatibility */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Search by your vehicle
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every part shows exact compatibility. No guesswork, no returns.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {vehicles.map((v) => (
              <motion.div
                key={v.make}
                variants={fadeUp}
                className="group rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/30 hover:glow-blue cursor-pointer"
                onClick={() => navigate(`/catalog?make=${v.make}`)}
              >
                <div className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {v.make}
                </div>
                <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {v.models.join(", ")}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Browse by category
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-xl mx-auto">
              From brake pads to engine components — find exactly what you need.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  variants={fadeUp}
                  className="group"
                >
                  <Link
                    to={`/catalog?category=${cat.name.toLowerCase()}`}
                    className="block rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:glow-blue"
                  >
                    <div className={`inline-flex rounded-lg bg-gradient-to-br ${cat.color} p-3`}>
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{cat.count}</div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why AutoParts Finder?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: Database,
                title: "Real Manufacturer Data",
                description: "Parts data sourced directly from manufacturer catalogs and the NHTSA database. No dummy data.",
              },
              {
                icon: Car,
                title: "VIN Decoder",
                description: "Enter any VIN to get detailed vehicle specs and find exact-fit parts. Powered by official NHTSA API.",
              },
              {
                icon: Shield,
                title: "Verified Compatibility",
                description: "Every part shows exact vehicle fitment data. Search by make, model, and year to find parts that fit.",
              },
              {
                icon: Zap,
                title: "Free API Integration",
                description: "All APIs used are completely free with no API keys required. NHTSA VPIC API for vehicle data.",
              },
              {
                icon: Globe,
                title: "Live Data",
                description: "Real-time data from government databases. Always up-to-date with the latest vehicle information.",
              },
              {
                icon: Shield,
                title: "Trusted Reviews",
                description: "Real ratings and reviews from verified buyers. Make confident purchases backed by community feedback.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30"
                >
                  <div className="inline-flex rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by car owners
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="rounded-xl border border-border/60 bg-card p-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="mt-4 border-t border-border/50 pt-4">
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 sm:p-12 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your part?
            </h2>
            <p className="relative mt-4 text-muted-foreground max-w-lg mx-auto">
              Decode your VIN or search by vehicle to find the right parts for your car.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/vin-decoder"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Car className="h-4 w-4" />
                Decode VIN
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Browse Parts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
