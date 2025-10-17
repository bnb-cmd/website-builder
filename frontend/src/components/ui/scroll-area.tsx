"use client";

import React from "react"
import { ScrollArea as MantineScrollArea } from "@mantine/core"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof MantineScrollArea> {
  className?: string;
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof MantineScrollArea>, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MantineScrollArea
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </MantineScrollArea>
    )
  }
)

ScrollArea.displayName = "ScrollArea"

// ScrollBar is not needed with Mantine ScrollArea as it handles scrolling internally
const ScrollBar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      />
    )
  }
)

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }