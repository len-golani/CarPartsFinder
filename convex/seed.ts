import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("categories").first();
    if (existing) return "Already seeded";

    // Seed categories
    const categoryData = [
      { name: "Brakes", slug: "brakes", description: "Brake pads, rotors, calipers, and brake fluid", icon: "shield", partCount: 45 },
      { name: "Engine", slug: "engine", description: "Filters, belts, spark plugs, and engine components", icon: "cpu", partCount: 62 },
      { name: "Suspension", slug: "suspension", description: "Shocks, struts, springs, and control arms", icon: "move-vertical", partCount: 38 },
      { name: "Exhaust", slug: "exhaust", description: "Mufflers, catalytic converters, and exhaust pipes", icon: "wind", partCount: 29 },
      { name: "Lighting", slug: "lighting", description: "Headlights, taillights, LED bars, and bulbs", icon: "lightbulb", partCount: 54 },
      { name: "Electrical", slug: "electrical", description: "Batteries, alternators, starters, and wiring", icon: "zap", partCount: 41 },
      { name: "Transmission", slug: "transmission", description: "Transmissions, clutch kits, and drivetrain parts", icon: "cog", partCount: 33 },
      { name: "Cooling", slug: "cooling", description: "Radiators, water pumps, and thermostats", icon: "thermometer-snowflake", partCount: 27 },
    ];

    const categoryIds: Record<string, string> = {};
    for (const cat of categoryData) {
      const id = await ctx.db.insert("categories", cat);
      categoryIds[cat.slug] = id;
    }

    function getCategoryId(slug: string) {
      const id = categoryIds[slug];
      if (!id) throw new Error(`Category ${slug} not found`);
      return id as Id<"categories">;
    }

    // Seed parts
    const parts = [
      // Brakes
      {
        name: "Ceramic Brake Pads (Front)",
        slug: "ceramic-brake-pads-front",
        description: "Premium ceramic brake pads for quiet, dust-free stopping. Designed for daily driving with excellent fade resistance and long pad life. Includes hardware kit.",
        price: 49.99,
        originalPrice: 64.99,
        sku: "BRK-CP-F001",
        categoryId: getCategoryId("brakes"),
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.8,
        reviewCount: 342,
        brand: "StopTech",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord"], years: "2016-2024" },
          { make: "Toyota", models: ["Camry", "Corolla"], years: "2018-2024" },
        ],
        specifications: [
          { key: "Position", value: "Front" },
          { key: "Material", value: "Ceramic" },
          { key: "Thickness", value: "12.5mm" },
          { key: "Warranty", value: "30,000 miles" },
        ],
        tags: ["brakes", "pads", "ceramic", "front", "daily driving"],
      },
      {
        name: "Drilled & Slotted Rotors (Rear)",
        slug: "drilled-slotted-rotors-rear",
        description: "Performance rotors with drilled holes and slots for superior heat dissipation and wet weather performance. Zinc-coated for corrosion resistance.",
        price: 89.99,
        sku: "BRK-DS-R001",
        categoryId: getCategoryId("brakes"),
        imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.6,
        reviewCount: 218,
        brand: "PowerStop",
        compatibility: [
          { make: "Ford", models: ["Mustang", "F-150"], years: "2015-2024" },
          { make: "Chevrolet", models: ["Camaro", "Silverado"], years: "2016-2024" },
        ],
        specifications: [
          { key: "Position", value: "Rear" },
          { key: "Diameter", value: "320mm" },
          { key: "Vane Count", value: "48" },
          { key: "Finish", value: "Zinc Coated" },
        ],
        tags: ["brakes", "rotors", "performance", "drilled", "slotted"],
      },
      {
        name: "Stainless Steel Brake Lines",
        slug: "stainless-steel-brake-lines",
        description: "Braided stainless steel brake lines for firmer pedal feel and improved braking response. DOT approved with all necessary fittings.",
        price: 34.99,
        sku: "BRK-SS-L001",
        categoryId: getCategoryId("brakes"),
        imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.7,
        reviewCount: 156,
        brand: "Russell",
        compatibility: [
          { make: "Subaru", models: ["WRX", "STI", "BRZ"], years: "2015-2024" },
        ],
        specifications: [
          { key: "Material", value: "Braided Stainless Steel" },
          { key: "Fitting Type", value: "AN-3" },
          { key: "Length", value: "Front & Rear Kit" },
          { key: "Certification", value: "DOT Approved" },
        ],
        tags: ["brakes", "lines", "stainless", "performance"],
      },
      // Engine
      {
        name: "Premium Oil Filter",
        slug: "premium-oil-filter",
        description: "High-efficiency synthetic media oil filter. Captures 99% of contaminants while maintaining excellent flow rate. 15,000 mile change interval.",
        price: 9.99,
        sku: "ENG-OF-P001",
        categoryId: getCategoryId("engine"),
        imageUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.9,
        reviewCount: 1203,
        brand: "Mobil 1",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord", "CR-V"], years: "2012-2024" },
          { make: "Toyota", models: ["Camry", "Corolla", "RAV4"], years: "2012-2024" },
          { make: "Ford", models: ["F-150", "Explorer"], years: "2015-2024" },
        ],
        specifications: [
          { key: "Type", value: "Spin-On" },
          { key: "Filter Media", value: "Synthetic Blend" },
          { key: "Anti-Drain Valve", value: "Yes" },
          { key: "Change Interval", value: "15,000 miles" },
        ],
        tags: ["engine", "oil", "filter", "maintenance"],
      },
      {
        name: "Performance Spark Plugs (Set of 4)",
        slug: "performance-spark-plugs-set4",
        description: "Iridium-tipped spark plugs for maximum spark efficiency and fuel economy. Pre-gapped and ready to install. Up to 50% longer life than standard plugs.",
        price: 24.99,
        sku: "ENG-SP-S004",
        categoryId: getCategoryId("engine"),
        imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.7,
        reviewCount: 876,
        brand: "NGK",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord"], years: "2016-2024" },
          { make: "Mazda", models: ["Mazda3", "Mazda6", "CX-5"], years: "2014-2024" },
        ],
        specifications: [
          { key: "Tip Material", value: "Iridium" },
          { key: "Thread Size", value: "14mm" },
          { key: "Gap", value: "0.028\"" },
          { key: "Heat Range", value: "7" },
        ],
        tags: ["engine", "spark", "plugs", "iridium", "performance"],
      },
      {
        name: "Cold Air Intake System",
        slug: "cold-air-intake-system",
        description: "Mandrel-bent aluminum intake tube with washable high-flow filter. Gains of 5-15 HP depending on application. Easy bolt-on installation.",
        price: 179.99,
        originalPrice: 219.99,
        sku: "ENG-CAI-S001",
        categoryId: getCategoryId("engine"),
        imageUrl: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.5,
        reviewCount: 432,
        brand: "K&N",
        compatibility: [
          { make: "Ford", models: ["Mustang", "Focus ST"], years: "2015-2024" },
          { make: "Chevrolet", models: ["Camaro", "Cruze"], years: "2016-2024" },
        ],
        specifications: [
          { key: "Tube Material", value: "6061 Aluminum" },
          { key: "Filter Type", value: "Washable/Cleanable" },
          { key: "HP Gain", value: "+5-15 HP" },
          { key: "Installation", value: "Bolt-On" },
        ],
        tags: ["engine", "intake", "cold air", "performance", "horsepower"],
      },
      // Suspension
      {
        name: "Adjustable Coilover Kit",
        slug: "adjustable-coilover-kit",
        description: "Fully adjustable coilover suspension kit with 32-level dampening. Lowers vehicle 1-3 inches with independent ride height and preload adjustment.",
        price: 899.99,
        originalPrice: 1099.99,
        sku: "SUS-CF-K001",
        categoryId: getCategoryId("suspension"),
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
        inStock: false,
        rating: 4.4,
        reviewCount: 189,
        brand: "BC Racing",
        compatibility: [
          { make: "Honda", models: ["Civic", "Civic Si"], years: "2016-2024" },
          { make: "Subaru", models: ["WRX", "STI"], years: "2015-2024" },
        ],
        specifications: [
          { key: "Dampening Levels", value: "32" },
          { key: "Drop Range", value: "1-3 inches" },
          { key: "Spring Rate", value: "8k Front / 6k Rear" },
          { key: "Construction", value: "Monotube" },
        ],
        tags: ["suspension", "coilover", "adjustable", "lowering", "performance"],
      },
      {
        name: "Performance Shock Absorbers (Pair)",
        slug: "performance-shock-absorbers",
        description: "Gas-charged monotube shock absorbers for improved handling and ride comfort. Engineered for both spirited driving and daily commuting.",
        price: 249.99,
        sku: "SUS-SH-P001",
        categoryId: getCategoryId("suspension"),
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.6,
        reviewCount: 298,
        brand: "Bilstein",
        compatibility: [
          { make: "Toyota", models: ["4Runner", "Tacoma"], years: "2010-2024" },
          { make: "Ford", models: ["F-150", "Ranger"], years: "2015-2024" },
        ],
        specifications: [
          { key: "Type", value: "Monotube" },
          { key: "Gas Charge", value: "Nitrogen" },
          { key: "Position", value: "Front & Rear" },
          { key: "Warranty", value: "Lifetime" },
        ],
        tags: ["suspension", "shocks", "performance", "handling"],
      },
      // Exhaust
      {
        name: "Cat-Back Exhaust System",
        slug: "cat-back-exhaust-system",
        description: "Stainless steel cat-back exhaust system with tuned muffler for deep, aggressive tone. Adds 10-15 HP and improves exhaust flow by 30%.",
        price: 449.99,
        sku: "EXH-CB-S001",
        categoryId: getCategoryId("exhaust"),
        imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.8,
        reviewCount: 567,
        brand: "MagnaFlow",
        compatibility: [
          { make: "Honda", models: ["Civic Si", "Civic Type R"], years: "2017-2024" },
          { make: "Ford", models: ["Mustang GT"], years: "2015-2024" },
        ],
        specifications: [
          { key: "Material", value: "T304 Stainless Steel" },
          { key: "Pipe Diameter", value: "2.5\"" },
          { key: "Muffler Type", value: "Straight-Through" },
          { key: "HP Gain", value: "+10-15 HP" },
        ],
        tags: ["exhaust", "cat-back", "performance", "sound", "horsepower"],
      },
      {
        name: "Performance Muffler",
        slug: "performance-muffler",
        description: "Universal fitment performance muffler with adjustable sound level. Minimal back pressure with a deep, refined tone.",
        price: 129.99,
        sku: "EXH-PM-U001",
        categoryId: getCategoryId("exhaust"),
        imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afe?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.3,
        reviewCount: 321,
        brand: "Flowmaster",
        compatibility: [
          { make: "Universal", models: ["All"], years: "2000-2024" },
        ],
        specifications: [
          { key: "Inlet Size", value: "2.5\"" },
          { key: "Outlet Size", value: "2.5\"" },
          { key: "Length", value: "27\"" },
          { key: "Finish", value: "Polished" },
        ],
        tags: ["exhaust", "muffler", "universal", "sound"],
      },
      // Lighting
      {
        name: "LED Headlight Conversion Kit",
        slug: "led-headlight-conversion-kit",
        description: "Ultra-bright 12,000 lumen LED headlight conversion kit. Plug-and-play installation with built-in cooling fans. 6000K pure white light.",
        price: 79.99,
        sku: "LGT-LH-C001",
        categoryId: getCategoryId("lighting"),
        imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.7,
        reviewCount: 934,
        brand: "Auxbeam",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord", "CR-V"], years: "2012-2024" },
          { make: "Toyota", models: ["Camry", "Corolla", "RAV4"], years: "2012-2024" },
          { make: "Ford", models: ["F-150", "Focus"], years: "2012-2024" },
          { make: "Chevrolet", models: ["Silverado", "Cruze"], years: "2012-2024" },
        ],
        specifications: [
          { key: "Lumens", value: "12,000 per pair" },
          { key: "Color Temp", value: "6000K" },
          { key: "Power", value: "30W per bulb" },
          { key: "Lifespan", value: "50,000 hours" },
        ],
        tags: ["lighting", "LED", "headlights", "bright", "plug-and-play"],
      },
      {
        name: "Sequential LED Turn Signals",
        slug: "sequential-led-turn-signals",
        description: "Dynamic sequential LED turn signals with amber flowing animation. Smoked lens design with built-in resistors for CAN-bus compatibility.",
        price: 39.99,
        sku: "LGT-ST-S001",
        categoryId: getCategoryId("lighting"),
        imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.5,
        reviewCount: 645,
        brand: "Vland",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord"], years: "2016-2024" },
          { make: "Toyota", models: ["Camry", "Supra"], years: "2018-2024" },
        ],
        specifications: [
          { key: "Type", value: "Sequential" },
          { key: "Lens", value: "Smoked" },
          { key: "CAN-bus", value: "Resistor Built-In" },
          { key: "Waterproof", value: "IP67" },
        ],
        tags: ["lighting", "turn signals", "LED", "sequential", "custom"],
      },
      // Electrical
      {
        name: "AGM Battery (Group 35)",
        slug: "agm-battery-group35",
        description: "Absorbed Glass Mat battery with 650 CCA. Superior vibration resistance and deep cycle capability. Ideal for vehicles with high electrical demands.",
        price: 189.99,
        sku: "ELC-BT-G035",
        categoryId: getCategoryId("electrical"),
        imageUrl: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.8,
        reviewCount: 456,
        brand: "Optima",
        compatibility: [
          { make: "Honda", models: ["Accord", "CR-V", "Pilot"], years: "2008-2024" },
          { make: "Toyota", models: ["Camry", "4Runner"], years: "2008-2024" },
        ],
        specifications: [
          { key: "Type", value: "AGM" },
          { key: "CCA", value: "650" },
          { key: "Reserve Capacity", value: "120 min" },
          { key: "Weight", value: "38 lbs" },
        ],
        tags: ["electrical", "battery", "AGM", "power"],
      },
      {
        name: "High-Output Alternator",
        slug: "high-output-alternator",
        description: "250-amp high output alternator for vehicles with aftermarket audio, lighting, or accessories. Direct bolt-on replacement with OEM fitment.",
        price: 279.99,
        sku: "ELC-ALT-H001",
        categoryId: getCategoryId("electrical"),
        imageUrl: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=300&fit=crop",
        inStock: false,
        rating: 4.6,
        reviewCount: 234,
        brand: "Mechman",
        compatibility: [
          { make: "Ford", models: ["F-150", "Mustang", "Explorer"], years: "2011-2024" },
          { make: "Chevrolet", models: ["Silverado", "Camaro"], years: "2014-2024" },
        ],
        specifications: [
          { key: "Output", value: "250 Amps" },
          { key: "Voltage", value: "14.4V" },
          { key: "Mounting", value: "OEM Direct" },
          { key: "Warranty", value: "2 Years" },
        ],
        tags: ["electrical", "alternator", "high-output", "power"],
      },
      // Transmission
      {
        name: "Performance Clutch Kit",
        slug: "performance-clutch-kit",
        description: "Stage 2 performance clutch kit with heavy-duty pressure plate and organic/ceramic disc. Handles up to 400 HP while maintaining street manners.",
        price: 349.99,
        sku: "TRN-CK-S002",
        categoryId: getCategoryId("transmission"),
        imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.5,
        reviewCount: 178,
        brand: "Exedy",
        compatibility: [
          { make: "Honda", models: ["Civic Si", "Civic Type R"], years: "2012-2024" },
          { make: "Subaru", models: ["WRX", "STI"], years: "2008-2024" },
        ],
        specifications: [
          { key: "Stage", value: "Stage 2" },
          { key: "Torque Rating", value: "400 lb-ft" },
          { key: "Disc Material", value: "Organic/Ceramic" },
          { key: "Includes", value: "Pressure Plate, Disc, Bearing, Alignment Tool" },
        ],
        tags: ["transmission", "clutch", "performance", "stage 2"],
      },
      // Cooling
      {
        name: "Aluminum Radiator",
        slug: "aluminum-radiator",
        description: "Full aluminum performance radiator with 40% more cooling capacity than stock. TIG-welded construction with bolt-on fitment.",
        price: 299.99,
        sku: "COL-AR-A001",
        categoryId: getCategoryId("cooling"),
        imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.7,
        reviewCount: 267,
        brand: "Mishimoto",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord"], years: "2012-2021" },
          { make: "Subaru", models: ["WRX", "STI"], years: "2015-2021" },
        ],
        specifications: [
          { key: "Material", value: "Aluminum" },
          { key: "Core Thickness", value: "42mm" },
          { key: "Cooling Capacity", value: "+40%" },
          { key: "Warranty", value: "Lifetime" },
        ],
        tags: ["cooling", "radiator", "aluminum", "performance"],
      },
      {
        name: "Thermostat & Housing Kit",
        slug: "thermostat-housing-kit",
        description: "Low-temperature thermostat kit for improved cooling performance. Opens at 160°F vs. stock 195°F. Includes gasket and housing.",
        price: 44.99,
        sku: "COL-TH-K001",
        categoryId: getCategoryId("cooling"),
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
        inStock: true,
        rating: 4.4,
        reviewCount: 189,
        brand: "Mishimoto",
        compatibility: [
          { make: "Honda", models: ["Civic", "Accord", "CR-V"], years: "2016-2024" },
        ],
        specifications: [
          { key: "Opening Temp", value: "160°F" },
          { key: "Stock Temp", value: "195°F" },
          { key: "Housing Material", value: "Aluminum" },
          { key: "Includes", value: "Thermostat, Housing, Gasket" },
        ],
        tags: ["cooling", "thermostat", "temperature", "performance"],
      },
    ];

    for (const part of parts) {
      await ctx.db.insert("parts", part);
    }

    return `Seeded ${categoryData.length} categories and ${parts.length} parts`;
  },
});
