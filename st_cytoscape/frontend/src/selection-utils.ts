/**
 * Selection management utilities
 */

import { Streamlit } from "streamlit-component-lib"
import type { Core, NodeSingular, EdgeSingular } from "cytoscape"
import type { ComponentSelection } from "./types/cytoscape"
import { DEBOUNCE_DELAY } from "./constants"

/**
 * Checks if two selection objects are equal
 */
export function selectionsEqual(
  a: ComponentSelection | null,
  b: ComponentSelection | null
): boolean {
  if (a === null && b === null) return true
  if (a === null || b === null) return false

  return (
    a.nodes.length === b.nodes.length &&
    a.edges.length === b.edges.length &&
    a.nodes.every((node, index) => node === b.nodes[index]) &&
    a.edges.every((edge, index) => edge === b.edges[index])
  )
}

/**
 * Creates a debounced selection updater
 */
export function createSelectionUpdater(
  announceSelection: (
    nodes: readonly string[],
    edges: readonly string[]
  ) => void
) {
  let lastSelection: ComponentSelection | null = null

  return function updateSelection(cy: Core, isDestroyed: () => boolean): void {
    try {
      // Check if component is destroyed to prevent memory leaks
      if (isDestroyed() || !cy) return

      const selectedNodes = cy.$("node:selected")
      const selectedEdges = cy.$("edge:selected")

      const selection: ComponentSelection = {
        nodes: selectedNodes.map((node: NodeSingular) => node.id()).sort(),
        edges: selectedEdges.map((edge: EdgeSingular) => edge.id()).sort(),
      }

      // Only update if selection has actually changed
      if (!selectionsEqual(selection, lastSelection)) {
        lastSelection = selection

        // Announce selection changes for accessibility
        announceSelection(selection.nodes, selection.edges)

        Streamlit.setComponentValue(selection)
      }
    } catch (error) {
      console.error("Error updating component selection:", error)
      // Fallback to empty selection
      if (!isDestroyed()) {
        Streamlit.setComponentValue({ nodes: [], edges: [] })
      }
    }
  }
}

/**
 * Creates a debounced event handler for selection changes
 */
export function createDebouncedSelectionHandler(
  updateSelection: (cy: Core, isDestroyed: () => boolean) => void,
  cy: Core,
  isDestroyed: () => boolean
) {
  let updateTimeout: NodeJS.Timeout | null = null

  return function handleSelectionChange(): void {
    if (cy && !isDestroyed()) {
      // Debounce rapid selection changes
      if (updateTimeout) clearTimeout(updateTimeout)
      updateTimeout = setTimeout(() => {
        if (cy && !isDestroyed()) {
          updateSelection(cy, isDestroyed)
        }
      }, DEBOUNCE_DELAY)
    }
  }
}

