"use client";

import React from "react";
import { Switch as MantineSwitch } from "@mantine/core";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.ComponentProps<typeof MantineSwitch>, 'onChange'> {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

function Switch({ className, onCheckedChange, ...props }: SwitchProps) {
  return (
    <MantineSwitch
      className={cn("", className)}
      onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      {...props}
    />
  );
}

export { Switch };
