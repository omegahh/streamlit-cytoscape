import { Streamlit, RenderData, Theme } from "streamlit-component-lib"
import cytoscape, { Core, NodeSingular, EdgeSingular } from "cytoscape"
import type {
  CytoscapeElement,
  CytoscapeStylesheet,
  CytoscapeLayout,
  ComponentSelection,
} from "./types/cytoscape"

// Extensions - using proper TypeScript imports
import fcose from "cytoscape-fcose"
import klay from "cytoscape-klay"

// Register Cytoscape extensions
cytoscape.use(fcose)
cytoscape.use(klay)

// Create main container with accessibility features
const div = document.body.appendChild(document.createElement("div"))
div.setAttribute("role", "img")
div.setAttribute("aria-label", "Interactive network graph")
div.setAttribute("tabindex", "0")
div.style.outline = "none" // Custom focus styling will be handled
div.style.position = "relative"

let args = ""
let currentCy: Core | null = null
let isDestroyed = false
let resizeObserver: ResizeObserver | null = null
let selectedElementsAnnouncer: HTMLElement | null = null

/**
 * Creates an accessibility announcer for screen readers
 */
function createAccessibilityAnnouncer(): HTMLElement {
  const announcer = document.createElement("div")
  announcer.setAttribute("aria-live", "polite")
  announcer.setAttribute("aria-atomic", "true")
  announcer.style.position = "absolute"
  announcer.style.left = "-10000px"
  announcer.style.width = "1px"
  announcer.style.height = "1px"
  announcer.style.overflow = "hidden"
  div.appendChild(announcer)
  return announcer
}

/**
 * Announces selection changes to screen readers
 */
function announceSelection(nodes: string[], edges: string[]): void {
  if (!selectedElementsAnnouncer) return

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

  selectedElementsAnnouncer.textContent = message
}

/**
 * Handles keyboard navigation for the graph
 */
function setupKeyboardNavigation(cy: Core): void {
  if (!cy) return

  div.addEventListener("keydown", (event: KeyboardEvent) => {
    if (isDestroyed || !cy) return

    const nodes = cy.nodes()
    const edges = cy.edges()
    const selectedNodes = cy.$("node:selected")
    const selectedEdges = cy.$("edge:selected")

    switch (event.key) {
      case "Tab":
        // Let default tab behavior work, but announce current selection
        setTimeout(() => {
          if (!isDestroyed) {
            announceSelection(
              selectedNodes.map((n) => n.id()),
              selectedEdges.map((e) => e.id())
            )
          }
        }, 100)
        break

      case "Enter":
      case " ":
        event.preventDefault()
        // Select first node if nothing selected, or toggle selection of focused element
        if (selectedNodes.length === 0 && selectedEdges.length === 0) {
          if (nodes.length > 0) {
            nodes.first().select()
          }
        }
        break

      case "Escape":
        event.preventDefault()
        // Clear all selections
        cy.$(":selected").unselect()
        break

      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault()
        // Select next element
        selectNextElement(cy, 1)
        break

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault()
        // Select previous element
        selectNextElement(cy, -1)
        break

      case "Home":
        event.preventDefault()
        // Select first element
        cy.$(":selected").unselect()
        if (nodes.length > 0) {
          nodes.first().select()
        }
        break

      case "End":
        event.preventDefault()
        // Select last element
        cy.$(":selected").unselect()
        if (nodes.length > 0) {
          nodes.last().select()
        }
        break
    }
  })
}

/**
 * Selects the next/previous element in the graph
 */
function selectNextElement(cy: Core, direction: number): void {
  const nodes = cy.nodes()
  const currentSelected = cy.$("node:selected").first()

  if (nodes.length === 0) return

  let newIndex = 0
  if (currentSelected.length > 0) {
    const currentIndex = nodes.indexOf(currentSelected)
    newIndex = (currentIndex + direction + nodes.length) % nodes.length
  }

  cy.$(":selected").unselect()
  nodes.eq(newIndex).select()
}

/**
 * Updates the component value with currently selected nodes and edges
 */
function updateComponent(cy: Core): void {
  try {
    // Check if component is destroyed to prevent memory leaks
    if (isDestroyed || !cy) {
      return
    }

    const selectedNodes = cy.$("node:selected")
    const selectedEdges = cy.$("edge:selected")

    const selection: ComponentSelection = {
      nodes: selectedNodes.map((node: NodeSingular) => node.id()),
      edges: selectedEdges.map((edge: EdgeSingular) => edge.id()),
    }

    // Announce selection changes for accessibility
    announceSelection(selection.nodes, selection.edges)

    Streamlit.setComponentValue(selection)
  } catch (error) {
    console.error("Error updating component selection:", error)
    // Fallback to empty selection
    if (!isDestroyed) {
      Streamlit.setComponentValue({ nodes: [], edges: [] })
    }
  }
}

/**
 * Generates theme-aware styles for the graph
 */
function generateThemeStyles(theme: Theme | undefined): CytoscapeStylesheet[] {
  try {
    if (!theme) return []

    const styles: CytoscapeStylesheet[] = []
    const isDarkTheme = theme.base === "dark"

    // Base node styles with theme colors
    const baseNodeStyle: any = {}
    if (theme.textColor) baseNodeStyle.color = theme.textColor
    if (theme.font) baseNodeStyle.fontFamily = theme.font

    // Use secondary background for default node background in dark themes
    if (theme.secondaryBackgroundColor && isDarkTheme) {
      baseNodeStyle.backgroundColor = theme.secondaryBackgroundColor
      baseNodeStyle.borderColor = theme.textColor || "#666"
      baseNodeStyle.borderWidth = 1
    }

    if (Object.keys(baseNodeStyle).length > 0) {
      styles.push({
        selector: "node",
        style: baseNodeStyle,
      })
    }

    // Enhanced selection styles with primary color
    if (theme.primaryColor) {
      styles.push(
        {
          selector: "node:selected",
          style: {
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor,
            borderWidth: 3,
            // Add subtle shadow for better visibility
            boxShadow: `0 0 10px ${theme.primaryColor}40`,
            color: isDarkTheme ? "#ffffff" : theme.textColor || "#000000",
          },
        },
        {
          selector: "edge:selected",
          style: {
            targetArrowColor: theme.primaryColor,
            sourceArrowColor: theme.primaryColor,
            lineColor: theme.primaryColor,
            width: 4,
            // Add subtle shadow for edges
            shadowColor: theme.primaryColor,
            shadowBlur: 8,
            shadowOpacity: 0.3,
          },
        }
      )
    }

    // Enhanced edge styles
    const baseEdgeStyle: any = {}
    if (theme.textColor) {
      baseEdgeStyle.lineColor = isDarkTheme ? "#666" : "#ccc"
      baseEdgeStyle.targetArrowColor = isDarkTheme ? "#666" : "#ccc"
      baseEdgeStyle.sourceArrowColor = isDarkTheme ? "#666" : "#ccc"
    }

    if (Object.keys(baseEdgeStyle).length > 0) {
      styles.push({
        selector: "edge",
        style: baseEdgeStyle,
      })
    }

    // Hover styles for better interactivity
    if (theme.primaryColor) {
      styles.push(
        {
          selector: "node:active",
          style: {
            backgroundColor: theme.primaryColor + "CC", // Semi-transparent
            borderColor: theme.primaryColor,
            borderWidth: 2,
          },
        },
        {
          selector: "edge:active",
          style: {
            lineColor: theme.primaryColor + "CC",
            targetArrowColor: theme.primaryColor + "CC",
            width: 3,
          },
        }
      )
    }

    // Label styles for better readability
    if (theme.textColor || theme.font) {
      styles.push({
        selector: "node, edge",
        style: {
          ...(theme.textColor && {
            "text-outline-color": isDarkTheme ? "#000000" : "#ffffff",
            "text-outline-width": 1,
          }),
          ...(theme.font && { fontFamily: theme.font }),
          fontSize: "12px",
          fontWeight: "500",
        },
      })
    }

    return styles
  } catch (error) {
    console.error("Error generating theme styles:", error)
    return []
  }
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  try {
    const data = (event as CustomEvent<RenderData>).detail

    if (!data || !data.args) {
      console.error("Invalid render data received")
      return
    }

    const newArgs = JSON.stringify(data.args)

    // Only re-render if args have changed or no key is provided
    if (!data.args.key || args !== newArgs) {
      args = newArgs

      try {
        // Update container dimensions
        div.style.width = data.args.width as string
        div.style.height = data.args.height as string

        // Apply enhanced theme styling
        if (data.theme) {
          // Primary background
          if (data.theme.backgroundColor) {
            div.style.backgroundColor = data.theme.backgroundColor
          }

          // Add subtle border for better definition
          if (data.theme.secondaryBackgroundColor) {
            div.style.border = `1px solid ${data.theme.secondaryBackgroundColor}`
            div.style.borderRadius = "4px"
          }

          // Ensure proper contrast
          const isDarkTheme = data.theme.base === "dark"
          if (isDarkTheme && !data.theme.backgroundColor) {
            div.style.backgroundColor = "#1e1e1e"
          }
        }

        // Generate theme-aware styles
        const themeStyles = generateThemeStyles(data.theme)
        const userStylesheet =
          (data.args.stylesheet as CytoscapeStylesheet[]) || []
        const combinedStyles = [...userStylesheet, ...themeStyles]

        // Destroy existing instance
        if (currentCy) {
          destroyComponent()
        }

        // Validate required data
        if (!data.args.elements || !Array.isArray(data.args.elements)) {
          throw new Error("Invalid or missing elements data")
        }

        // Create accessibility announcer
        if (!selectedElementsAnnouncer) {
          selectedElementsAnnouncer = createAccessibilityAnnouncer()
        }

        // Update ARIA label with graph information
        const nodeCount = (data.args.elements as CytoscapeElement[]).filter(
          (e) => !e.data.source
        ).length
        const edgeCount = (data.args.elements as CytoscapeElement[]).filter(
          (e) => e.data.source
        ).length
        div.setAttribute(
          "aria-label",
          `Interactive network graph with ${nodeCount} nodes and ${edgeCount} edges. Use arrow keys to navigate, Enter or Space to select, Escape to clear selection.`
        )

        // Create new Cytoscape instance
        currentCy = cytoscape({
          container: div,
          elements: data.args.elements as CytoscapeElement[],
          style: combinedStyles,
          layout: (data.args.layout as CytoscapeLayout) || { name: "grid" },
          selectionType:
            (data.args.selectionType as "single" | "additive") || "additive",
          userZoomingEnabled: data.args.userZoomingEnabled !== false,
          userPanningEnabled: data.args.userPanningEnabled !== false,
          minZoom: (data.args.minZoom as number) || 1e-50,
          maxZoom: (data.args.maxZoom as number) || 1e50,
        })

        // Attach event listeners
        currentCy.on("select unselect", () => {
          if (currentCy && !isDestroyed) updateComponent(currentCy)
        })

        // Setup keyboard navigation
        setupKeyboardNavigation(currentCy)

        // Add focus styling
        div.addEventListener("focus", () => {
          if (!isDestroyed) {
            div.style.boxShadow = "0 0 0 2px #0066cc"
          }
        })

        div.addEventListener("blur", () => {
          div.style.boxShadow = "none"
        })

        // Setup resize observer for responsive behavior
        if (resizeObserver) {
          resizeObserver.disconnect()
        }

        resizeObserver = new ResizeObserver(() => {
          if (currentCy && !isDestroyed) {
            // Debounce resize calls
            setTimeout(() => {
              if (currentCy && !isDestroyed) {
                currentCy.resize()
                currentCy.fit()
              }
            }, 100)
          }
        })

        resizeObserver.observe(div)

        // Initial update
        updateComponent(currentCy)
      } catch (renderError) {
        console.error("Error during component render:", renderError)

        // Create fallback display
        div.innerHTML = `
          <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100%; 
            color: #666; 
            font-family: sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <p>⚠️ Graph rendering error</p>
              <p style="font-size: 0.8em; margin-top: 10px;">Check console for details</p>
            </div>
          </div>
        `
      }
    }

    Streamlit.setFrameHeight()
  } catch (error) {
    console.error("Critical error in onRender:", error)
  }
}

// Initialize component
function initializeComponent(): void {
  try {
    // Attach event listener
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

    // Tell Streamlit we're ready
    Streamlit.setComponentReady()

    // Set initial frame height
    Streamlit.setFrameHeight()
  } catch (error) {
    console.error("Error initializing component:", error)
  }
}

// Comprehensive cleanup function for when component is destroyed
function cleanup(): void {
  try {
    isDestroyed = true

    // Disconnect resize observer
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    // Destroy Cytoscape instance and clean up event listeners
    if (currentCy) {
      // Remove all event listeners
      currentCy.removeAllListeners()

      // Destroy the instance
      currentCy.destroy()
      currentCy = null
    }

    // Clean up accessibility features
    if (selectedElementsAnnouncer && selectedElementsAnnouncer.parentNode) {
      selectedElementsAnnouncer.parentNode.removeChild(
        selectedElementsAnnouncer
      )
      selectedElementsAnnouncer = null
    }

    // Clean up DOM elements
    if (div && div.parentNode) {
      // Remove event listeners from div
      div.removeEventListener("keydown", () => {})
      div.removeEventListener("focus", () => {})
      div.removeEventListener("blur", () => {})

      div.innerHTML = "" // Clear content first
      div.parentNode.removeChild(div)
    }

    // Remove window event listeners
    window.removeEventListener("beforeunload", cleanup)

    // Clear any pending timeouts (in case resize observer created any)
    // Note: In a real implementation, you might want to track timeout IDs
  } catch (error) {
    console.error("Error during component cleanup:", error)
  }
}

// Enhanced cleanup for component unmounting
function destroyComponent(): void {
  try {
    isDestroyed = true

    // Disconnect resize observer
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    // Destroy Cytoscape instance
    if (currentCy) {
      currentCy.removeAllListeners()
      currentCy.destroy()
      currentCy = null
    }

    // Clean up accessibility announcer if it exists
    if (selectedElementsAnnouncer && selectedElementsAnnouncer.parentNode) {
      selectedElementsAnnouncer.parentNode.removeChild(
        selectedElementsAnnouncer
      )
      selectedElementsAnnouncer = null
    }
  } catch (error) {
    console.error("Error destroying component:", error)
  }
}

// Handle page unload
window.addEventListener("beforeunload", cleanup)

// Initialize the component
try {
  initializeComponent()
} catch (error) {
  console.error("Failed to initialize Cytoscape component:", error)
}
