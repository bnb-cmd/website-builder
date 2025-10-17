"use client";

import React from "react";
import { HoverCard as MantineHoverCard, Button } from "@mantine/core";

import { cn } from "@/lib/utils";

function HoverCard({ 
  openDelay = 200,
  closeDelay = 200,
  children, 
  ...props 
}: React.ComponentProps<typeof MantineHoverCard> & {
  openDelay?: number;
  closeDelay?: number;
}) {
  return (
    <MantineHoverCard
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    >
      {children}
    </MantineHoverCard>
  );
}

function HoverCardTrigger({ children, ...props }: React.ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}

function HoverCardContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  sideOffset?: number;
}) {
  return (
    <div
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };