"use client";

import React from "react";
import { 
  Root as DropdownMenuPrimitiveRoot,
  Portal as DropdownMenuPrimitivePortal,
  Trigger as DropdownMenuPrimitiveTrigger,
  Content as DropdownMenuPrimitiveContent,
  Group as DropdownMenuPrimitiveGroup,
  Item as DropdownMenuPrimitiveItem,
  CheckboxItem as DropdownMenuPrimitiveCheckboxItem,
  RadioGroup as DropdownMenuPrimitiveRadioGroup,
  RadioItem as DropdownMenuPrimitiveRadioItem,
  Label as DropdownMenuPrimitiveLabel,
  Separator as DropdownMenuPrimitiveSeparator,
  Sub as DropdownMenuPrimitiveSub,
  SubTrigger as DropdownMenuPrimitiveSubTrigger,
  SubContent as DropdownMenuPrimitiveSubContent,
  ItemIndicator as DropdownMenuPrimitiveItemIndicator
} from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from '@/lib/icons';

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitiveRoot;

const DropdownMenuPortal = DropdownMenuPrimitivePortal;

const DropdownMenuTrigger = DropdownMenuPrimitiveTrigger;

interface DropdownMenuContentProps extends React.ComponentProps<typeof DropdownMenuPrimitiveContent> {
  className?: string;
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveContent>, DropdownMenuContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => {
    return (
      <DropdownMenuPrimitivePortal>
        <DropdownMenuPrimitiveContent
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
            className,
          )}
          {...props}
        />
      </DropdownMenuPrimitivePortal>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuGroup = DropdownMenuPrimitiveGroup;

interface DropdownMenuItemProps extends React.ComponentProps<typeof DropdownMenuPrimitiveItem> {
  className?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
}

const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveItem>, DropdownMenuItemProps>(
  ({ className, inset, variant = "default", ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveItem
        ref={ref}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

interface DropdownMenuCheckboxItemProps extends React.ComponentProps<typeof DropdownMenuPrimitiveCheckboxItem> {
  className?: string;
}

const DropdownMenuCheckboxItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveCheckboxItem>, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveCheckboxItem
        ref={ref}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        checked={checked}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuPrimitiveItemIndicator>
            <CheckIcon className="size-4" />
          </DropdownMenuPrimitiveItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitiveCheckboxItem>
    );
  }
);

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioGroup = DropdownMenuPrimitiveRadioGroup;

interface DropdownMenuRadioItemProps extends React.ComponentProps<typeof DropdownMenuPrimitiveRadioItem> {
  className?: string;
}

const DropdownMenuRadioItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveRadioItem>, DropdownMenuRadioItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveRadioItem
        ref={ref}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuPrimitiveItemIndicator>
            <CircleIcon className="size-2 fill-current" />
          </DropdownMenuPrimitiveItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitiveRadioItem>
    );
  }
);

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

interface DropdownMenuLabelProps extends React.ComponentProps<typeof DropdownMenuPrimitiveLabel> {
  className?: string;
  inset?: boolean;
}

const DropdownMenuLabel = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveLabel>, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveLabel
        ref={ref}
        className={cn(
          "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
          className,
        )}
        {...props}
      />
    );
  }
);

DropdownMenuLabel.displayName = "DropdownMenuLabel";

interface DropdownMenuSeparatorProps extends React.ComponentProps<typeof DropdownMenuPrimitiveSeparator> {
  className?: string;
}

const DropdownMenuSeparator = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveSeparator>, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveSeparator
        ref={ref}
        className={cn("bg-border -mx-1 my-1 h-px", className)}
        {...props}
      />
    );
  }
);

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

interface DropdownMenuShortcutProps extends React.ComponentProps<"span"> {
  className?: string;
}

const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "text-muted-foreground ml-auto text-xs tracking-widest",
          className,
        )}
        {...props}
      />
    );
  }
);

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const DropdownMenuSub = DropdownMenuPrimitiveSub;

interface DropdownMenuSubTriggerProps extends React.ComponentProps<typeof DropdownMenuPrimitiveSubTrigger> {
  className?: string;
  inset?: boolean;
}

const DropdownMenuSubTrigger = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveSubTrigger>, DropdownMenuSubTriggerProps>(
  ({ className, inset, children, ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveSubTrigger
        ref={ref}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto size-4" />
      </DropdownMenuPrimitiveSubTrigger>
    );
  }
);

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

interface DropdownMenuSubContentProps extends React.ComponentProps<typeof DropdownMenuPrimitiveSubContent> {
  className?: string;
}

const DropdownMenuSubContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitiveSubContent>, DropdownMenuSubContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <DropdownMenuPrimitiveSubContent
        ref={ref}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
          className,
        )}
        {...props}
      />
    );
  }
);

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
