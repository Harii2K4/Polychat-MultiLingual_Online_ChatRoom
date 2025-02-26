import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    users: defineTable({
        fullName: v.string(),
        username: v.string(),
        title: v.string(),
        about: v.string(),
        profileImageUrl: v.optional(v.string()),
        tokenIdentifier: v.string(),
        customTag: v.optional(v.string()),
        password: v.optional(v.string()), // Added optional password field
        // Added user preferences
        notificationsEnabled: v.optional(v.boolean()),
        darkMode: v.optional(v.boolean()),
        showOnlineStatus: v.optional(v.boolean()),
        lastOnline: v.optional(v.number()), // Timestamp for last online status
        isOnline: v.optional(v.boolean()), // Online status flag
    })
        .searchIndex("search_fullName", {
            searchField: "fullName",
        })
        .searchIndex("search_username", {
            searchField: "username",
        })
        .index("by_token", ["tokenIdentifier"])
        .index("by_username", ["username"]),

    messages: defineTable({
        userId: v.id("users"),
        Engtext: v.optional(v.string()),
        Frenchtext: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        seen: v.boolean(),
        conversationId: v.id("conversations"),
    })
        .index('by_conversationId', ['conversationId']),

    conversations: defineTable({
        participantOneId: v.id("users"),
        participantTwoId: v.id("users"),
        participantOneLang: v.optional(v.string()),
        participantTwoLang: v.optional(v.string())
    })
        .index('by_participantOneId', ['participantOneId', 'participantTwoId'])
        .index('by_participantTwoId', ['participantTwoId', 'participantOneId']),
});