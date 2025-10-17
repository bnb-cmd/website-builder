"use client";

import React from "react";
import { Select as MantineSelect } from "@mantine/core";
import { cn } from "@/lib/utils";

interface SelectProps extends React.ComponentProps<typeof MantineSelect> {
  className?: string;
}

function Select({ className, ...props }: SelectProps) {
  return (
    <MantineSelect
      className={cn("w-full", className)}
      {...props}
    />
  );
}

// For backward compatibility, export the same interface
export {
  Select,
  Select as SelectContent,
  Select as SelectGroup,
  Select as SelectItem,
  Select as SelectLabel,
  Select as SelectScrollDownButton,
  Select as SelectScrollUpButton,
  Select as SelectSeparator,
  Select as SelectTrigger,
  Select as SelectValue,
};
