"use client";

import React from "react";
import { Drawer as MantineDrawer, Button } from "@mantine/core";
import { XIcon } from '@/lib/icons';

import { cn } from "@/lib/utils";

function Sheet({ 
  open, 
  onOpenChange, 
  children, 
  ...props 
}: React.ComponentProps<typeof MantineDrawer> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <MantineDrawer
      opened={open || false}
      onClose={() => onOpenChange?.(false)}
      {...props}
    >
      {children}
    </MantineDrawer>
  );
}

function SheetTrigger({ children, ...props }: React.ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}

function SheetClose({ children, ...props }: React.ComponentProps<typeof Button>) {
  return <Button variant="subtle" {...props}>{children}</Button>;
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

function SheetContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};