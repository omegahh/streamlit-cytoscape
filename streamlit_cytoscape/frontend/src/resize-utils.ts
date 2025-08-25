/**
 * Resize handling utilities
 */

import type { Core } from "cytoscape"
import { RESIZE_DEBOUNCE_DELAY } from "./constants"

/**
 * Sets up responsive graph resizing with debounced calls
 */
export function setupResizeObserver(
  container: HTMLElement,
  cy: Core,
  isDestroyed: () => boolean
): ResizeObserver {
  const resizeObserver = new ResizeObserver(() => {
    if (cy && !isDestroyed()) {
      // Debounce resize calls
      setTimeout(() => {
        if (cy && !isDestroyed()) {
          cy.resize()
          cy.fit()
        }
      }, RESIZE_DEBOUNCE_DELAY)
    }
  })

  resizeObserver.observe(container)
  return resizeObserver
}

/**
 * Cleanup resize observer
 */
export function cleanupResizeObserver(
  resizeObserver: ResizeObserver | null
): void {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
}

