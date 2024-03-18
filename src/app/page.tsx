import { PinnedSummary } from "@/components/PinnedSummary";
import { UTubeForm } from "@/components/UTubeForm";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export default async function Home() {
  const data = await preloadQuery(api.youtube.getPinnedVideos);

  return (
    <main className="sm:p-24 p-12">
      <div className="sm:max-w-3xl mx-auto ">
        <h1 className="sm:text-4xl text-lg font-bold text-center tracking-tight text-neutral-100">
          Quikly Summarize Youtube Videos
        </h1>
        <p className="mt-6 sm:text-sm text-xs text-center text-gray-500">
          Turn lengthy YouTube videos into concise summaries. Perfect for
          lectures, events, or meetings. Made possible by AI technology
        </p>
        <UTubeForm />

        {/* recent  */}

        <div className="mt-20 flex flex-col space-y-4">
          <h4 className="sm:text-xl text-md font-bold tracking-tight text-neutral-100">
            Pinned Summaries
          </h4>
          <div>
            <PinnedSummary preloadData={data} />
          </div>

          {/* <div className="text-right">
            <Link
              href="/recent"
              className="text-neutral-500 border border-neutral-400 p-2 rounded-md text-center"
            >
              View all
            </Link>
          </div> */}
        </div>
      </div>
    </main>
  );
}
