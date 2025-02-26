import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const markAsSeen = mutation({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, { conversationId }) => {
        // Fetch all messages in the conversation (using the correct index)
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) =>
                q.eq("conversationId", conversationId)
            )
            .collect();

        // Filter only unseen messages
        const unseenMessages = messages.filter((msg) => !msg.seen);

        if (unseenMessages.length === 0) return; // No messages to update

        // Batch update messages to mark them as seen
        await Promise.all(
            unseenMessages.map((message) =>
                ctx.db.patch(message._id, { seen: true })
            )
        );
    },
});


export const send = mutation({
    args: { Engtext: v.optional(v.string()), Frenchtext: v.optional(v.string()), userId: v.id("users"), imageUrl: v.optional(v.string()), seen: v.boolean(), conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const { Engtext, Frenchtext, userId, imageUrl, seen, conversationId } = args;
        await ctx.db.insert("messages", {
            Engtext,
            Frenchtext,
            userId,
            imageUrl,
            seen,
            conversationId,
        });
    },
});

export const get = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("messages")
            .collect();
    },
});

export const getLast = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const message = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .first();
        return message;
    },
});