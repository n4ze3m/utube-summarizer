import { ContentSummary } from "@/components/ContentSummary";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: { params: { slug: string } }) {
    const data = await preloadQuery(api.youtube.getYoutubeSummaryById, { slug: params.slug })
  return (
    <div className="my-6 p-12 max-w-4xl mx-auto">
        <ContentSummary  preloadData={data} />
    </div>
  );
}
