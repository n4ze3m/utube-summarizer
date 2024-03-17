"use node"

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { YtTranscript } from "yt-transcript"
import { ChatFireworks } from "@langchain/community/chat_models/fireworks"
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";



const getYoutubeInfo = async (id: string) => {
    const url = `https://noembed.com/embed?dataType=json&url=https://www.youtube.com/watch?v=${id}`
    const response = await fetch(url)
    if (!response.ok) {
        return { title: undefined, thumbnail_url: undefined }
    }
    const data = await response.json() as { title: string, thumbnail_url: string }
    return data
}


export const processYoutubeAction = internalAction({
    args: {
        id: v.id("youtube"),
        video_id: v.string(),
    },
    handler: async (ctx, args) => {

        const info = await getYoutubeInfo(args.video_id)

        if (!process.env.FIREWORKS_API_KEY) {

            await ctx.runMutation(internal.youtube.updateYoutube, {
                id: args.id,
                is_error: true,
                error_message: "FIREWORKS_API_KEY is not set",
                title: info.title,
                thumbnail_url: info.thumbnail_url
            })
            throw new Error("FIREWORKS_API_KEY is not set")
        }


        const transcript = new YtTranscript({ videoId: args.video_id })

        const transcriptText = await transcript.getTranscript()

        if (!transcriptText) {
            await ctx.runMutation(internal.youtube.updateYoutube, {
                id: args.id,
                is_error: true,
                error_message: "Transcript not found",
                title: info.title,
                thumbnail_url: info.thumbnail_url

            })
            throw new Error("Transcript not found")
        }

        if (transcriptText.length === 0) {
            await ctx.runMutation(internal.youtube.updateYoutube, {
                id: args.id,
                is_error: true,
                error_message: "Transcript is empty or not available",
                title: info.title,
                thumbnail_url: info.thumbnail_url

            })
            throw new Error("Transcript is empty")
        }


        const prompt = PromptTemplate.fromTemplate(`You are a youtube transcript summarizer. Use the following rules to summarize the transcript.


1. Must be detailed and accurate to the original content.

2. Must be concise and to the point.

3. Must be in your own words.

4. Must generate from context.

5. Must return summary in a markdown format.

--- context

{transcript}

---


Summary:
`)

        const mistralModel = new ChatFireworks({
            modelName: "accounts/fireworks/models/mixtral-8x7b-instruct",
            streaming: false,
            maxTokens: 4096,
            fireworksApiKey: process.env.FIREWORKS_API_KEY,
        });

        const stringOutputParser = new StringOutputParser()


        const chain = prompt.pipe(mistralModel).pipe(stringOutputParser)

        const result = await chain.invoke({ transcript: transcriptText.map(t => `[${t.start}-${t.duration}] ${t.text}`).join("\n") })

        await ctx.runMutation(internal.youtube.updateYoutube, {
            id: args.id,
            summary: result,
            title: info.title,
            thumbnail_url: info.thumbnail_url
        })
    }
})