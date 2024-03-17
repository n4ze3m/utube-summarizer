import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    youtube: defineTable({
        url: v.string(),
        title: v.optional(v.string()),
        summary: v.optional(v.string()),
        video_id: v.string(),
        is_finished: v.boolean(),
        pinned: v.boolean(),
        slug: v.string(),
        is_error: v.optional(v.boolean()),
        error_message: v.optional(v.string()),
        thumbnail_url: v.optional(v.string()),
    })
})