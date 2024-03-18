"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, SparkleIcon } from "lucide-react";
const formSchema = z.object({
  url: z
    .string()
    .url({
      message: "Please enter a valid URL",
    })
    .refine(
      (url) => {
        const regex =
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
        const match = url.match(regex);
        return match ? true : false;
      },
      {
        message: "Please enter a valid YouTube URL",
      }
    ),
});

type Props = {
  preloadData: Preloaded<typeof api.youtube.getHighlights>;
};
export const UTubeForm = ({ preloadData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const data = usePreloadedQuery(preloadData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const router = useRouter();

  const onProcessVideo = useMutation(api.youtube.processYoutube);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const youtube = await onProcessVideo(data);
    router.push(`/summary/${youtube}`);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-12 flex flex-col space-y-4 text-center"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Paste a YouTube URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <div className="flex justify-center">
        <Button className="gap-2" disabled={isLoading} type="submit">
          {isLoading ? (
            <RefreshCcw className="animate-spin h-5 w-5" />
          ) : (
            <SparkleIcon className="h-5 w-5" />
          )}
          {isLoading ? "Processing..." : "Summarize Video"}
        </Button>
        </div>
        <span className="text-gray-500 text-center text-xs">
          {data.totalVideos} videos summarized so far
        </span>
      </form>
    </Form>
  );
};
