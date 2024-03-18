"use client";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VideoCard } from "./VideoCard";

type Props = {
  preloadData: Preloaded<typeof api.youtube.getHighlights>;
};

export const PinnedSummary = ({ preloadData }: Props) => {
  const data = usePreloadedQuery(preloadData);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data?.youtube.map((video) => {
        return (
          <VideoCard
            key={video.slug}
            img={video.thumbnail_url || ""}
            slug={video.slug}
            title={video.title || "Untitle"}
          />
        );
      })}
    </div>
  );
};
