"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Markdown from "./Markdown";
import { Loading } from "./Loading";
import { Hourglass } from "lucide-react";

type Props = {
  preloadData: Preloaded<typeof api.youtube.getYoutubeSummaryById>;
};

export const Summary = ({
  title,
  summary,
  video_id,
}: {
  title: string;
  summary: string;
  video_id: string;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="sm:text-3xl text-lg font-bold">{title}</h1>
      <iframe
        height="200"
        src={`https://www.youtube.com/embed/${video_id}`}
        title={title}
        frameBorder="0"
        className="sm:w-[400px] w-full h-200"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Markdown message={summary || ""} />
    </div>
  );
};

export const Error = ({
  title,
  message,
  video_id,
}: {
  title: string;
  video_id: string;
  message: string;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <iframe
        width="400"
        height="200"
        src={`https://www.youtube.com/embed/${video_id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p className="text-red-500 text-lg">{message}</p>
    </div>
  );
};

export const HoldOnProcessing = () => {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto text-center">
      <div className="w-12 h-12 mx-auto">
        <Hourglass className="h-12 w-12 animate-spin delay-75" />
      </div>
      <p className="text-gray-600 text-lg">
        Hold on, we are processing the video
      </p>
    </div>
  );
};

export const ContentSummary = ({ preloadData }: Props) => {
  const data = usePreloadedQuery(preloadData);

  return (
    <div>
      {data ? (
        <>
          {data.is_finished && !data.is_error && (
            <Summary
              title={data?.title || ""}
              summary={data?.summary || ""}
              video_id={data.video_id}
            />
          )}
          {data.is_error && (
            <Error
              title={data?.title || ""}
              video_id={data.video_id}
              message={data.error_message || ""}
            />
          )}
          {!data.is_finished && <HoldOnProcessing />}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
