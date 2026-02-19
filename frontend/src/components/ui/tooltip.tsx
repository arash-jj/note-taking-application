import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Renders a tooltip context provider with a data-slot attribute for styling hooks.
 *
 * @param delayDuration - Time in milliseconds to wait before showing the tooltip (default 0)
 * @returns A React element that provides tooltip context and attributes for nested tooltip components
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/**
 * Renders a tooltip root element that forwards all received props and adds a `data-slot="tooltip"` attribute.
 *
 * @param props - Props forwarded to the underlying Tooltip root component.
 * @returns The tooltip root JSX element.
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/**
 * Renders a tooltip trigger element that forwards all received props and adds a `data-slot="tooltip-trigger"` attribute.
 *
 * @param props - Props forwarded to the underlying tooltip trigger element
 * @returns A tooltip trigger element with `data-slot="tooltip-trigger"` and all forwarded props
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * Renders tooltip content inside a portal with default styling, a position offset, and a built-in arrow.
 *
 * @param className - Additional CSS classes merged with the component's default styles.
 * @param sideOffset - Distance in pixels between the trigger and the tooltip; defaults to 0.
 * @param children - Elements displayed inside the tooltip content.
 * @returns The rendered TooltipPrimitive.Content element (wrapped in a Portal) with an arrow.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }