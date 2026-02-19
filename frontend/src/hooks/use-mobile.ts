import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Determines whether the current viewport is considered mobile using a 768px breakpoint and keeps the value updated while mounted.
 *
 * Subscribes to viewport size changes and updates the returned value accordingly.
 *
 * @returns `true` if the viewport width is less than 768 pixels, `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}