"use client";

import React from "react";
import { Popover as MantinePopover, Button } from "@mantine/core";

import { cn } from "@/lib/utils";

function Popover({ 
  open, 
  onOpenChange, 
  children, 
  ...props 
}: React.ComponentProps<typeof MantinePopover> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <MantinePopover
      opened={open || false}
      onClose={() => onOpenChange?.(false)}
      {...props}
    >
      {children}
    </MantinePopover>
  );
}

function PopoverTrigger({ children, ...props }: React.ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "center" | "end";
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

function PopoverAnchor({ ...props }: React.ComponentProps<"div">) {
  return <div {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };