"use client";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import ReactMarkdown from "react-markdown";
import "property-information";
import React from "react";

export default function Markdown({ message }: { message: string }) {
  return (
    <React.Fragment>
      <ReactMarkdown
        className="prose dark:prose-invert max-w-none w-full  dark:text-gray-300 text-gray-700"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax]}
      >
        {message}
      </ReactMarkdown>
    </React.Fragment>
  );
}
