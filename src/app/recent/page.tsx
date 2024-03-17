import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { RecentVideo } from "@/components/RecentVideo";

export default async function Page() {
  const data = await preloadQuery(api.youtube.getAllVideos);
  return (
    <main className="sm:p-24 p-12">
      <div className="sm:max-w-3xl mx-auto space-y-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-100">
          Recent Summaries
        </h1>
        <RecentVideo preloadData={data} />
      </div>
    </main>
  );
}
