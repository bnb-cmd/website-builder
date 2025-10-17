"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.ComponentProps<"div"> {
  ratio?: number;
}

function AspectRatio({
  ratio = 16 / 9,
  className,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full", className)}
      style={{
        aspectRatio: ratio.toString(),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { AspectRatio };