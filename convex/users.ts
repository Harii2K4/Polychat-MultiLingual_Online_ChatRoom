import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";

import { api, internal } from "./_generated/api";

export const store = mutation({
    args: {
        profileImageUrl: v.string(), // Accepting profile image URL as an argument
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we've already stored this identity before.
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value.
            const updates: Record<string, any> = {};
            if (user.username !== identity.nickname) {
                updates.username = identity.nickname;
            }
            if (args.profileImageUrl && user.profileImageUrl !== args.profileImageUrl) {
                updates.profileImageUrl = args.profileImageUrl;
            }
            if (Object.keys(updates).length > 0) {
                await ctx.db.patch(user._id, updates);
            }
            return user._id;
        }

        // If it's a new identity, create a new `User`.
        const userId = await ctx.db.insert("users", {
            fullName: identity.name!,
            tokenIdentifier: identity.tokenIdentifier,
            title: "",
            about: "",
            username: identity.nickname!,
            profileImageUrl: args.profileImageUrl || "", // Store the provided image URL or default to an empty string
            notificationsEnabled: true,  // Default to true
            darkMode: false,             // Default to false
            showOnlineStatus: true,      // Default to true
            isOnline: true,              // Default to true
            lastOnline: Date.now(),      // Current timestamp
            /*password: args.password || undefined*/
        });

        return userId;
    },
});



export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    },
});

export const updateAbout = mutation({
    args: {
        userId: v.id("users"),
        about: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, about } = args;

        await ctx.db.patch(userId, {
            about: about,
        });
    },
})


export const get = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        if (args.id) {
            const user = await ctx.db.get(args.id);
            return user;
        }
        else {
            return null;
        }

    },
});







export const getUserByUsername = query({
    args: { username: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.username === undefined) return null;
        if (!args.username) return null;
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username!))
            .unique();

        return user;
    },
});
// convex/users.ts (add this query to your existing file)
export const searchUsers = query({
    args: { searchQuery: v.string() },
    handler: async (ctx, args) => {
        const fullNameResults = await ctx.db
            .query("users")
            .withSearchIndex("search_fullName", (q) => q.search("fullName", args.searchQuery))
            .take(5);

        const usernameResults = await ctx.db
            .query("users")
            .withSearchIndex("search_username", (q) => q.search("username", args.searchQuery))
            .take(5);

        // Combine and deduplicate results
        const combinedResults = [...fullNameResults, ...usernameResults];
        const uniqueResults = Array.from(new Set(combinedResults.map(user => user._id)))
            .map(id => combinedResults.find(user => user._id === id));

        return uniqueResults.slice(0, 5); // Limit to 5 results
    },
});

export const deleteUser = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        await ctx.db.delete(userId);
    },
});

export const updateOnlineStatus = mutation({
    args: {
        userId: v.id("users"),
        isOnline: v.boolean(),
        lastOnline: v.optional(v.number())  // Made lastOnline optional
    },
    handler: async (ctx, args) => {
        const updateData: any = {
            isOnline: args.isOnline,
        };

        // Only update lastOnline if provided (when going offline)
        if (args.lastOnline !== null) {
            updateData.lastOnline = args.lastOnline;
        }

        await ctx.db.patch(args.userId, updateData);
    },
});


export const getCurrentUserOnlineStatus = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        return user;
    },
});