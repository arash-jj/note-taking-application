import { cn } from "@/lib/utils"

/**
 * Renders a rectangular skeleton loader div with a pulsing background and rounded corners.
 *
 * @param className - Additional CSS class names appended to the base skeleton classes.
 * @returns A div element with `data-slot="skeleton"` and the combined skeleton classes.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }