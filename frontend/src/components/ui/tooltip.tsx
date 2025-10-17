"use client";

import React from "react";
import { Tooltip as MantineTooltip } from "@mantine/core";
import { cn } from "@/lib/utils";

function TooltipProvider({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return <div {...props}>{children}</div>;
}

function Tooltip({
  children,
  ...props
}: React.ComponentProps<typeof MantineTooltip>) {
  return (
    <MantineTooltip {...props}>
      {children}
    </MantineTooltip>
  );
}

function TooltipTrigger({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return <div {...props}>{children}</div>;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
