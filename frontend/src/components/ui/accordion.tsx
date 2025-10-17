"use client";

import React from "react";
import { Accordion as MantineAccordion } from "@mantine/core";
import { cn } from "@/lib/utils";

function Accordion({
  children,
  ...props
}: React.ComponentProps<typeof MantineAccordion>) {
  return (
    <MantineAccordion {...props}>
      {children}
    </MantineAccordion>
  );
}

function AccordionItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-b last:border-b-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("overflow-hidden text-sm pt-0 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
