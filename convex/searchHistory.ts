import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("searchHistory")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);
  },
});

export const add = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user) return;

    await ctx.db.insert("searchHistory", {
      userId: user._id,
      query: args.query,
      filters: args.filters,
      resultCount: args.resultCount,
    });
  },
});
