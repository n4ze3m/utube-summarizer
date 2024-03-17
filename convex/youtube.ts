import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getYoutubeSummaryById = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const youtube = await ctx.db.query("youtube").filter((q) => q.eq(q.field("slug"), args.slug)).first()
        return youtube

    }
})


export const getPinnedVideos = query({
    handler: async (ctx) => {
        const youtube = await ctx.db.query("youtube").filter((q) => q.eq(q.field("pinned"), true)).order("desc").take(3)
        return youtube
    }
})

export const getAllVideos = query({
    handler: async (ctx) => {
        const youtube = await ctx.db.query("youtube").order("desc").collect()
        return youtube
    }
})


export const processYoutube = mutation({
    args: {
        url: v.string(),
    },
    handler: async (ctx, args) => {
        const url = args.url
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
        const match = url.match(regex)
        const video_id = match ? match[1] : "xxxxxx"

        let slug = "youtube-" + video_id + "-" + Date.now()
        slug = slug.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

        const youtube = await ctx.db.insert("youtube", {
            url,
            video_id,
            is_finished: false,
            pinned: false,
            slug,
        })

        await ctx.scheduler.runAfter(0, internal.process.processYoutubeAction, {
            id: youtube,
            video_id,
        })

        return slug
    }
})


export const updateYoutube = internalMutation({
    args: {
        id: v.id("youtube"),
        title: v.optional(v.string()),
        summary: v.optional(v.string()),
        is_error: v.optional(v.boolean()),
        error_message: v.optional(v.string()),
        thumbnail_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const youtube = await ctx.db.patch(args.id, {
            is_finished: true,
            error_message: args.error_message,
            is_error: args.is_error,
            summary: args.summary,
            title: args.title,
            thumbnail_url: args.thumbnail_url,
        })

        return youtube
    }
})