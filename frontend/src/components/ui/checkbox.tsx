"use client"

import React from "react"
import { Checkbox as MantineCheckbox } from "@mantine/core"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof MantineCheckbox>, 'onChange'> {
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = ({ className, onCheckedChange, ...props }: CheckboxProps) => {
  return (
    <MantineCheckbox
      className={cn("", className)}
      onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      {...props}
    />
  )
}

Checkbox.displayName = "Checkbox"

export { Checkbox }