import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const getByUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        // current user
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        if (!currentUser) {
            throw new Error("Couldn't authenticate user");
        }

        const conversations = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.eq(q.field("participantOneId"), currentUser._id),
                    q.eq(q.field("participantTwoId"), currentUser._id)
                )
            )
            .collect();
        return conversations;
    }
});



export const getConversation = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        // current user
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        if (!currentUser) {
            throw new Error("Couldn't authenticate user");
        }

        // other user
        const otherUser = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();

        const conversation = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("participantOneId"), currentUser._id),
                        q.eq(q.field("participantTwoId"), otherUser?._id)
                    ),
                    q.and(
                        q.eq(q.field("participantOneId"), otherUser?._id),
                        q.eq(q.field("participantTwoId"), currentUser._id)
                    )
                )
            )
            .unique();

        const messages = await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("conversationId"), conversation?._id))
            .collect();

        const messagesWithUsersRelation = messages.map(async (message: any) => {
            const user = await ctx.db.query("users")
                .filter((q: any) => q.eq(q.field("_id"), message.userId))
                .unique();
            return {
                ...message,
                user
            }
        });

        const messagesWithUsers = await Promise.all(messagesWithUsersRelation);

        return {
            currentUser,
            otherUser,
            conversation,
            messagesWithUsers
        };
    }
});

export const getOrCreateConversation = mutation({
    args: { otherUsername: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        // current user
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        if (!currentUser) {
            throw new Error("Couldn't authenticate user");
        }

        // other user
        const otherUser = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.otherUsername))
            .unique();

        if (!otherUser) {
            throw new Error("User not found");
        }

        let conversation = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("participantOneId"), currentUser._id),
                        q.eq(q.field("participantTwoId"), otherUser._id)
                    ),
                    q.and(
                        q.eq(q.field("participantOneId"), otherUser._id),
                        q.eq(q.field("participantTwoId"), currentUser._id)
                    )
                )
            )
            .unique();

        if (!conversation) {
            const conversationId = await ctx.db.insert("conversations", {
                participantOneId: currentUser._id,
                participantTwoId: otherUser._id,
                participantOneLang: "English",
                participantTwoLang: "English",
            });

            conversation = await ctx.db.get(conversationId);
        }

        const messages = await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("conversationId"), conversation?._id))
            .collect();

        const messagesWithUsersRelation = messages.map(async (message: any) => {
            const user = await ctx.db.query("users")
                .filter((q: any) => q.eq(q.field("_id"), message.userId))
                .unique();
            return {
                ...message,
                user
            }
        });

        const messagesWithUsers = await Promise.all(messagesWithUsersRelation);

        return {
            currentUser,
            otherUser,
            conversation,
            messagesWithUsers
        };
    }
});

export const updateParticipantLanguage = mutation({
    args: {
        userid: v.id("users"),
        username: v.string(),
        language: v.string()
    },
    handler: async (ctx, args) => {
        const { userid, username, language } = args;

        if (!userid) {
            throw new Error("Couldn't authenticate user");
        }

        // Find other user
        const otherUser = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", username))
            .unique();

        if (!otherUser) {
            throw new Error("Other user not found");
        }

        // Find conversation between users
        const conversation = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("participantOneId"), userid),
                        q.eq(q.field("participantTwoId"), otherUser._id)
                    ),
                    q.and(
                        q.eq(q.field("participantOneId"), otherUser._id),
                        q.eq(q.field("participantTwoId"), userid)
                    )
                )
            )
            .unique();

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        // Update the appropriate language field
        if (conversation.participantOneId === userid) {
            return await ctx.db.patch(conversation._id, {
                participantOneLang: language
            });
        } else {
            return await ctx.db.patch(conversation._id, {
                participantTwoLang: language
            });
        }
    }
});

export const getParticipantLanguage = query({
    args: {
        userid: v.id("users"),
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const { userid, username } = args;

        if (!userid) {
            throw new Error("Couldn't authenticate user");
        }

        // Find other user
        const otherUser = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", username))
            .unique();

        if (!otherUser) {
            throw new Error("Other user not found");
        }

        // Find conversation between users
        const conversation = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("participantOneId"), userid),
                        q.eq(q.field("participantTwoId"), otherUser._id)
                    ),
                    q.and(
                        q.eq(q.field("participantOneId"), otherUser._id),
                        q.eq(q.field("participantTwoId"), userid)
                    )
                )
            )
            .unique();

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        // Update the appropriate language field
        if (conversation.participantOneId === userid) {
            return conversation.participantOneLang;
        } else {
            return conversation.participantTwoLang
        }
    }
});