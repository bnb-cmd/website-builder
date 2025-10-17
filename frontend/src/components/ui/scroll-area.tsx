"use client";

import React from "react"
import { 
  Root as ScrollAreaPrimitiveRoot,
  Viewport as ScrollAreaPrimitiveViewport,
  ScrollAreaScrollbar as ScrollAreaPrimitiveScrollAreaScrollbar,
  ScrollAreaThumb as ScrollAreaPrimitiveScrollAreaThumb,
  Corner as ScrollAreaPrimitiveCorner
} from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitiveRoot> {
  className?: string;
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitiveRoot>, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitiveRoot
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitiveViewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitiveViewport>
      <ScrollBar />
      <ScrollAreaPrimitiveCorner />
    </ScrollAreaPrimitiveRoot>
  )
)

ScrollArea.displayName = "ScrollArea"

interface ScrollBarProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitiveScrollAreaScrollbar> {
  className?: string;
  orientation?: "vertical" | "horizontal";
}

const ScrollBar = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitiveScrollAreaScrollbar>, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitiveScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitiveScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitiveScrollAreaScrollbar>
  )
)

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }