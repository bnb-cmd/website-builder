import React from "react";
import { NavLink as MantineNavLink } from "@mantine/core";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from '@/lib/icons';

import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof MantineNavLink> & {
  viewport?: boolean;
}) {
  return (
    <MantineNavLink
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </MantineNavLink>
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn("", className)}
      {...props}
    >
      {children}
    </button>
  );
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("", className)}
      {...props}
    />
  );
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn("", className)}
      {...props}
    />
  );
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("", className)}
      {...props}
    />
  );
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("", className)}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};