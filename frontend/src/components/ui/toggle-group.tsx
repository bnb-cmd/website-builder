"use client";

import React from "react";
import { SegmentedControl as MantineSegmentedControl } from "@mantine/core";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  value,
  onValueChange,
  type = "single",
  ...props
}: React.ComponentProps<typeof MantineSegmentedControl> &
  VariantProps<typeof toggleVariants> & {
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    type?: "single" | "multiple";
  }) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <MantineSegmentedControl
        value={value as string}
        onChange={onValueChange as (value: string) => void}
        className={cn("", className)}
        {...props}
      >
        {children}
      </MantineSegmentedControl>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & {
  value: string;
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

export { ToggleGroup, ToggleGroupItem };