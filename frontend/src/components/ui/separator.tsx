import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Render a styled separator element that wraps Radix UI's Separator.Root.
 *
 * Applies orientation and decorative attributes, merges provided CSS classes, and forwards remaining props to the underlying Radix component.
 *
 * @param className - Additional CSS classes to apply to the separator.
 * @param orientation - Layout orientation, either `"horizontal"` or `"vertical"`. Defaults to `"horizontal"`.
 * @param decorative - If `true`, marks the separator as decorative for accessibility. Defaults to `true`.
 * @returns The configured Separator.Root element.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }