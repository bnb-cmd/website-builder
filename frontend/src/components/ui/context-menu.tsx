"use client";

import React from "react";
import { Menu as MantineMenu, Button } from "@mantine/core";
import { CheckIcon, ChevronRightIcon, CircleIcon } from '@/lib/icons';

import { cn } from "@/lib/utils";

function ContextMenu({ 
  children, 
  ...props 
}: React.ComponentProps<typeof MantineMenu>) {
  return (
    <MantineMenu {...props}>
      {children}
    </MantineMenu>
  );
}

function ContextMenuTrigger({ children, ...props }: React.ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}

function ContextMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("", className)} {...props} />
  );
}

function ContextMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

function ContextMenuRadioGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

function ContextMenuSub({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props} />
  );
}

function ContextMenuSubTrigger({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};