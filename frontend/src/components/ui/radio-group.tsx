"use client";

import React from "react";
import { Radio as MantineRadio, RadioGroup as MantineRadioGroup } from "@mantine/core";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends Omit<React.ComponentProps<typeof MantineRadioGroup>, 'onChange'> {
  className?: string;
  onValueChange?: (value: string) => void;
}

function RadioGroup({
  className,
  children,
  onValueChange,
  ...props
}: RadioGroupProps) {
  return (
    <MantineRadioGroup
      className={cn("grid gap-3", className)}
      onChange={onValueChange}
      {...props}
    >
      {children}
    </MantineRadioGroup>
  );
}

function RadioGroupItem({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof MantineRadio> & { value: string }) {
  return (
    <MantineRadio
      value={value}
      className={cn("", className)}
      {...props}
    >
      {children}
    </MantineRadio>
  );
}

export { RadioGroup, RadioGroupItem };
