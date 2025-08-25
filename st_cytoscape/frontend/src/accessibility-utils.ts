/**
 * Accessibility utilities and functions
 */

import { ACCESSIBILITY } from "./constants"

/**
 * Creates an accessibility announcer for screen readers
 */
export function createAccessibilityAnnouncer(
  container: HTMLElement
): HTMLElement {
  const announcer = document.createElement("div")
  announcer.setAttribute("aria-live", "polite")
  announcer.setAttribute("aria-atomic", "true")

  Object.assign(announcer.style, ACCESSIBILITY.ANNOUNCER)

  container.appendChild(announcer)
  return announcer
}

/**
 * Announces selection changes to screen readers
 */
export function announceSelection(
  announcer: HTMLElement | null,
  nodes: readonly string[],
  edges: readonly string[]
): void {
  if (!announcer) return

  let message = ""
  if (nodes.length > 0 && edges.length > 0) {
    message = `Selected ${nodes.length} node${nodes.length > 1 ? "s" : ""} and ${edges.length} edge${edges.length > 1 ? "s" : ""}`
  } else if (nodes.length > 0) {
    message = `Selected ${nodes.length} node${nodes.length > 1 ? "s" : ""}: ${nodes.join(", ")}`
  } else if (edges.length > 0) {
    message = `Selected ${edges.length} edge${edges.length > 1 ? "s" : ""}: ${edges.join(", ")}`
  } else {
    message = "No elements selected"
  }

  announcer.textContent = message
}

/**
 * Sets up container accessibility attributes
 */
export function setupContainerAccessibility(
  container: HTMLElement,
  nodeCount: number,
  edgeCount: number
): void {
  container.setAttribute("role", "img")
  container.setAttribute("tabindex", "0")
  container.setAttribute(
    "aria-label",
    `Interactive network graph with ${nodeCount} nodes and ${edgeCount} edges. Use arrow keys to navigate, Enter or Space to select, Escape to clear selection.`
  )
  container.style.outline = "none" // Custom focus styling will be handled
}

/**
 * Sets up focus styling for the container
 */
export function setupFocusStyling(
  container: HTMLElement,
  isDestroyed: () => boolean
): void {
  const focusHandler = () => {
    if (!isDestroyed()) {
      container.style.boxShadow = "0 0 0 2px #0066cc"
    }
  }

  const blurHandler = () => {
    container.style.boxShadow = "none"
  }

  container.addEventListener("focus", focusHandler)
  container.addEventListener("blur", blurHandler)

  // Store references for cleanup
  ;(container as any)._focusHandler = focusHandler
  ;(container as any)._blurHandler = blurHandler
}

/**
 * Cleanup accessibility event listeners
 */
export function cleanupAccessibilityListeners(container: HTMLElement): void {
  const focusHandler = (container as any)._focusHandler
  const blurHandler = (container as any)._blurHandler

  if (focusHandler) {
    container.removeEventListener("focus", focusHandler)
    delete (container as any)._focusHandler
  }

  if (blurHandler) {
    container.removeEventListener("blur", blurHandler)
    delete (container as any)._blurHandler
  }
}

/**
 * Cleanup accessibility announcer
 */
export function cleanupAccessibilityAnnouncer(
  announcer: HTMLElement | null
): void {
  if (announcer && announcer.parentNode) {
    announcer.parentNode.removeChild(announcer)
  }
}
