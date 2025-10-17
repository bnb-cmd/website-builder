"use client";

import React from "react";
import { Root as AvatarPrimitiveRoot, Image as AvatarPrimitiveImage, Fallback as AvatarPrimitiveFallback } from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitiveRoot> {
  className?: string;
}

const Avatar = ({ className, ...props }: AvatarProps) => {
  return (
    <AvatarPrimitiveRoot
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
};

Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitiveImage> {
  className?: string;
}

const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
  return (
    <AvatarPrimitiveImage
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
};

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitiveFallback> {
  className?: string;
}

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
  return (
    <AvatarPrimitiveFallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
};

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
