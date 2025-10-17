"use client";

import React from "react";
import { Slider as MantineSlider } from "@mantine/core";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof MantineSlider>) {
  return (
    <MantineSlider
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export { Slider };
