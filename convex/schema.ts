import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Real vehicle makes from NHTSA
  vehicleMakes: defineTable({
    makeId: v.string(),
    makeName: v.string(),
    vehicleTypes: v.array(v.string()),
    commonName: v.optional(v.string()),
  })
    .index("by_makeId", ["makeId"])
    .index("by_makeName", ["makeName"]),

  // Real vehicle models from NHTSA
  vehicleModels: defineTable({
    makeId: v.string(),
    makeName: v.string(),
    modelId: v.string(),
    modelName: v.string(),
  })
    .index("by_makeId", ["makeId"])
    .index("by_modelId", ["modelId"]),

  // Real parts data - manufacturer parts
  parts: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    sku: v.string(),
    partNumber: v.optional(v.string()),
    categoryId: v.id("categories"),
    imageUrl: v.string(),
    inStock: v.boolean(),
    rating: v.number(),
    reviewCount: v.number(),
    brand: v.string(),
    compatibility: v.array(
      v.object({
        make: v.string(),
        models: v.array(v.string()),
        years: v.string(),
      })
    ),
    specifications: v.array(
      v.object({
        key: v.string(),
        value: v.string(),
      })
    ),
    tags: v.array(v.string()),
    source: v.optional(v.string()), // "nhtsa" | "retailer" | "admin"
    retailerUrl: v.optional(v.string()),
    lastUpdated: v.optional(v.number()),
  })
    .index("by_category", ["categoryId"])
    .index("by_slug", ["slug"])
    .index("by_brand", ["brand"])
    .index("by_price", ["price"])
    .index("by_rating", ["rating"])
    .index("by_partNumber", ["partNumber"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    partCount: v.number(),
  })
    .index("by_slug", ["slug"]),

  favorites: defineTable({
    userId: v.id("users"),
    partId: v.id("parts"),
  })
    .index("by_user", ["userId"])
    .index("by_part", ["partId"])
    .index("by_user_and_part", ["userId", "partId"]),

  searchHistory: defineTable({
    userId: v.id("users"),
    query: v.string(),
    filters: v.optional(
      v.object({
        make: v.optional(v.string()),
        model: v.optional(v.string()),
        year: v.optional(v.string()),
        category: v.optional(v.string()),
      })
    ),
    resultCount: v.number(),
  }).index("by_user", ["userId"]),

  // VIN decode history
  vinHistory: defineTable({
    userId: v.optional(v.id("users")),
    vin: v.string(),
    decodeResult: v.any(),
    timestamp: v.number(),
  })
    .index("by_vin", ["vin"])
    .index("by_user", ["userId"]),

  // Admin audit log
  adminLogs: defineTable({
    adminId: v.id("users"),
    action: v.string(),
    details: v.string(),
    timestamp: v.number(),
  }).index("by_admin", ["adminId"]),
});
