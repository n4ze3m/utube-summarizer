import { Skeleton } from "./ui/skeleton";

export const Loading = () => {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto text-center">
      <Skeleton className="h-[20px] w-[600px]  " />

      <Skeleton className="h-[200px] w-[400px] rounded-xl" />

      <Skeleton className="h-[125px] w-full " />
    </div>
  );
};
