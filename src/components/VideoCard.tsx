import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  img: string;
  slug: string;
  title: string;
};

export const VideoCard = ({ img, slug, title }: Props) => {
  return (
    <Link
      href={`/summary/${slug}`}
      className="flex flex-col space-y-3  border rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
    >
      <img
        src={img}
        alt={title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-2">
        <span className="text-sm line-clamp-3 ">{title}</span>
      </div>
    </Link>
  );
};
