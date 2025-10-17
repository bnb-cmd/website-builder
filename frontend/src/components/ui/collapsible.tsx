"use client";

import React from "react";
import { Collapse as MantineCollapse, Button } from "@mantine/core";

function Collapsible({ 
  open, 
  onOpenChange, 
  children, 
  ...props 
}: React.ComponentProps<typeof MantineCollapse> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <MantineCollapse
      in={open || false}
      {...props}
    >
      {children}
    </MantineCollapse>
  );
}

function CollapsibleTrigger({ children, ...props }: React.ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}

function CollapsibleContent({ children, ...props }: React.ComponentProps<"div">) {
  return <div {...props}>{children}</div>;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };