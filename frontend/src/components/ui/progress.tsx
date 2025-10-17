"use client";

import React from "react"
import { Progress as MantineProgress } from "@mantine/core"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MantineProgress>
>(({ className, value, ...props }, ref) => {
  return (
    <MantineProgress
      ref={ref}
      value={value}
      className={cn("w-full", className)}
      {...props}
    />
  )
})
Progress.displayName = "Progress"

export { Progress }