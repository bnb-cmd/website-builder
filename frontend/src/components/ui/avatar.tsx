"use client";

import React from "react";
import { Avatar as MantineAvatar } from "@mantine/core";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<typeof MantineAvatar> {
  className?: string;
}

const Avatar = ({ className, ...props }: AvatarProps) => {
  return (
    <MantineAvatar
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
};

Avatar.displayName = "Avatar";

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

const AvatarImage = ({ src, alt, className, ...props }: AvatarImageProps) => {
  return (
    <MantineAvatar
      src={src}
      alt={alt}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
};

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps {
  children?: React.ReactNode;
  className?: string;
}

const AvatarFallback = ({ children, className, ...props }: AvatarFallbackProps) => {
  return (
    <MantineAvatar
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </MantineAvatar>
  );
};

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
