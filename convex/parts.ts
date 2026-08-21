import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    search: v.optional(v.string()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    inStockOnly: v.optional(v.boolean()),
    sortBy: v.optional(
      v.union(
        v.literal("price_asc"),
        v.literal("price_desc"),
        v.literal("rating"),
        v.literal("newest")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let parts = await ctx.db.query("parts").collect();

    // Filter by category
    if (args.categoryId) {
      parts = parts.filter((p) => p.categoryId === args.categoryId);
    }

    // Filter by search text
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      parts = parts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          p.sku.toLowerCase().includes(searchLower)
      );
    }

    // Filter by make/model/year
    if (args.make || args.model || args.year) {
      parts = parts.filter((p) =>
        p.compatibility.some((c) => {
          if (args.make && c.make.toLowerCase() !== args.make.toLowerCase()) return false;
          if (args.model && !c.models.some((m) => m.toLowerCase() === args.model!.toLowerCase())) return false;
          if (args.year) {
            const yearNum = parseInt(args.year);
            const parts2 = c.years.split("-").map(Number);
            const start = parts2[0] ?? 0;
            const end = parts2[1] ?? 9999;
            if (yearNum < start || yearNum > end) return false;
          }
          return true;
        })
      );
    }

    // Price filters
    if (args.minPrice !== undefined) {
      parts = parts.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      parts = parts.filter((p) => p.price <= args.maxPrice!);
    }

    // In stock filter
    if (args.inStockOnly) {
      parts = parts.filter((p) => p.inStock);
    }

    // Sort
    switch (args.sortBy) {
      case "price_asc":
        parts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        parts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        parts.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        parts.sort((a, b) => b._creationTime - a._creationTime);
        break;
    }

    // Limit
    const limit = args.limit ?? 50;
    return parts.slice(0, limit);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("parts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("parts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("parts")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const parts = await ctx.db.query("parts").collect();
    return parts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  },
});

export const getMakes = query({
  args: {},
  handler: async (ctx) => {
    const parts = await ctx.db.query("parts").collect();
    const makes = new Set<string>();
    for (const part of parts) {
      for (const c of part.compatibility) {
        makes.add(c.make);
      }
    }
    return [...makes].sort();
  },
});

export const getModelsByMake = query({
  args: { make: v.string() },
  handler: async (ctx, args) => {
    const parts = await ctx.db.query("parts").collect();
    const models = new Set<string>();
    for (const part of parts) {
      for (const c of part.compatibility) {
        if (c.make.toLowerCase() === args.make.toLowerCase()) {
          for (const m of c.models) {
            models.add(m);
          }
        }
      }
    }
    return [...models].sort();
  },
});

export const getYearsByMakeModel = query({
  args: { make: v.string(), model: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const parts = await ctx.db.query("parts").collect();
    const years = new Set<string>();
    for (const part of parts) {
      for (const c of part.compatibility) {
        if (c.make.toLowerCase() === args.make.toLowerCase()) {
          if (!args.model || c.models.some((m) => m.toLowerCase() === args.model!.toLowerCase())) {
            const parts2 = c.years.split("-").map(Number);
            const start = parts2[0] ?? 0;
            const end = parts2[1] ?? 9999;
            for (let y = start; y <= end; y++) {
              years.add(String(y));
            }
          }
        }
      }
    }
    return [...years].sort().reverse();
  },
});

export const getBrands = query({
  args: {},
  handler: async (ctx) => {
    const parts = await ctx.db.query("parts").collect();
    const brands = new Set<string>();
    for (const part of parts) {
      brands.add(part.brand);
    }
    return [...brands].sort();
  },
});
