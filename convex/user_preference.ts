import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateUserPreferences = mutation({
    args: {
        notificationsEnabled: v.optional(v.boolean()),
        darkMode: v.optional(v.boolean()),
        showOnlineStatus: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        // Get the user's ID based on their token
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Separate updates for boolean preferences and timestamp
        const updates: Partial<{
            notificationsEnabled: boolean;
            darkMode: boolean;
            showOnlineStatus: boolean;
            lastOnline: number;
        }> = {};

        if (args.notificationsEnabled !== undefined) {
            updates.notificationsEnabled = args.notificationsEnabled;
        }
        if (args.darkMode !== undefined) {
            updates.darkMode = args.darkMode;
        }
        if (args.showOnlineStatus !== undefined) {
            updates.showOnlineStatus = args.showOnlineStatus;

        }

        // Update the user record
        await ctx.db.patch(user._id, updates);
        return updates;
    },
});

export const updateLastOnline = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Only update lastOnline if showOnlineStatus is enabled
        if (user.showOnlineStatus) {
            await ctx.db.patch(user._id, {
                lastOnline: Date.now(),
            });
        }
    },
});

export const getUnreadMessagesCount = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return 0;
        }

        // Get the user
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .first();

        if (!user) {
            return 0;
        }

        // Get all conversations where the user is a participant
        const conversations = await ctx.db
            .query("conversations")
            .filter(q =>
                q.or(
                    q.eq(q.field("participantOneId"), user._id),
                    q.eq(q.field("participantTwoId"), user._id)
                )
            )
            .collect();

        // Get unread messages from all conversations
        let unreadCount = 0;
        for (const conversation of conversations) {
            const unreadMessages = await ctx.db
                .query("messages")
                .withIndex("by_conversationId")
                .filter(q =>
                    q.and(
                        q.eq(q.field("conversationId"), conversation._id),
                        q.eq(q.field("seen"), false),
                        q.neq(q.field("userId"), user._id)
                    )
                )
                .collect();

            unreadCount += unreadMessages.length;
        }

        return unreadCount;
    },
});

// Query to get user's last active time
export const getUserStatus = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        // Consider user online if last active within last 5 minutes
        const isOnline = user.lastOnline ?
            Date.now() - user.lastOnline < 5 * 60 * 1000 :
            false;

        return {
            isOnline,
            lastActive: user.lastOnline
        };
    },
});

// Mutation to update user's last active time
/*export const updateUserActivity = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .first();

        if (!user) return;

        // Update last active time and online status
        await ctx.db.patch(user._id, {
            lastOnline: Date.now(),
            isOnline: true
        });
    },
})*/