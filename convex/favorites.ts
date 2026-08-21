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

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const parts = [];
    for (const fav of favorites) {
      const part = await ctx.db.get(fav.partId);
      if (part) {
        parts.push({ ...part, favoriteId: fav._id });
      }
    }
    return parts;
  },
});

export const isFavorited = query({
  args: { partId: v.id("parts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user) return false;

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_part", (q) =>
        q.eq("userId", user._id).eq("partId", args.partId)
      )
      .unique();

    return existing !== null;
  },
});

export const toggle = mutation({
  args: { partId: v.id("parts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_part", (q) =>
        q.eq("userId", user._id).eq("partId", args.partId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("favorites", {
        userId: user._id,
        partId: args.partId,
      });
      return true;
    }
  },
});
