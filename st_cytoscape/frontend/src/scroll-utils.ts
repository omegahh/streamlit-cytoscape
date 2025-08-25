/**
 * Scroll protection utilities
 */

/**
 * Prevents scroll events from interfering with canvas size
 */
export function setupScrollProtection(container: HTMLElement): void {
  const wheelHandler = (event: WheelEvent) => {
    // Only prevent default if this would cause scrolling of parent
    if (
      container.scrollHeight <= container.clientHeight &&
      container.scrollWidth <= container.clientWidth
    ) {
      event.preventDefault()
    }
  }

  container.addEventListener("wheel", wheelHandler, { passive: false })

  // Store reference for cleanup
  ;(container as any)._wheelHandler = wheelHandler
}

/**
 * Cleanup scroll protection
 */
export function cleanupScrollProtection(container: HTMLElement): void {
  const handler = (container as any)._wheelHandler
  if (handler) {
    container.removeEventListener("wheel", handler)
    delete (container as any)._wheelHandler
  }
}

