/**
 * Keyboard navigation utilities
 */

import type { Core } from "cytoscape"
import { KEYBOARD_ANNOUNCEMENT_DELAY } from "./constants"

/**
 * Sets up comprehensive keyboard navigation for the graph
 */
export function setupKeyboardNavigation(
  cy: Core,
  container: HTMLElement,
  isDestroyed: () => boolean,
  announceSelection: (
    nodes: readonly string[],
    edges: readonly string[]
  ) => void
): void {
  if (!cy) return

  const keydownHandler = (event: KeyboardEvent) => {
    if (isDestroyed() || !cy) return

    const nodes = cy.nodes()
    const selectedNodes = cy.$("node:selected")
    const selectedEdges = cy.$("edge:selected")

    switch (event.key) {
      case "Tab":
        // Let default tab behavior work, but announce current selection
        setTimeout(() => {
          if (!isDestroyed()) {
            announceSelection(
              selectedNodes.map((n) => n.id()),
              selectedEdges.map((e) => e.id())
            )
          }
        }, KEYBOARD_ANNOUNCEMENT_DELAY)
        break

      case "Enter":
      case " ":
        event.preventDefault()
        if (
          selectedNodes.length === 0 &&
          selectedEdges.length === 0 &&
          nodes.length > 0
        ) {
          nodes.first().select()
        }
        break

      case "Escape":
        event.preventDefault()
        cy.$(":selected").unselect()
        break

      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault()
        selectNextElement(cy, 1)
        break

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault()
        selectNextElement(cy, -1)
        break

      case "Home":
        event.preventDefault()
        cy.$(":selected").unselect()
        if (nodes.length > 0) {
          nodes.first().select()
        }
        break

      case "End":
        event.preventDefault()
        cy.$(":selected").unselect()
        if (nodes.length > 0) {
          nodes.last().select()
        }
        break
    }
  }

  container.addEventListener("keydown", keydownHandler)

  // Store reference for cleanup
  ;(container as any)._keydownHandler = keydownHandler
}

/**
 * Selects the next/previous element in the graph
 */
function selectNextElement(cy: Core, direction: number): void {
  const nodes = cy.nodes()
  if (nodes.length === 0) return

  const currentSelected = cy.$("node:selected").first()
  let newIndex = 0

  if (currentSelected.length > 0) {
    // Find current index
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]?.same(currentSelected)) {
        newIndex = (i + direction + nodes.length) % nodes.length
        break
      }
    }
  }

  cy.$(":selected").unselect()
  nodes.eq(newIndex).select()
}

/**
 * Cleanup keyboard navigation
 */
export function cleanupKeyboardNavigation(container: HTMLElement): void {
  const handler = (container as any)._keydownHandler
  if (handler) {
    container.removeEventListener("keydown", handler)
    delete (container as any)._keydownHandler
  }
}

