import { Streamlit, RenderData, Theme } from "streamlit-component-lib"
import cytoscape, { Core, NodeSingular, EdgeSingular } from "cytoscape"
import type { CytoscapeElement, CytoscapeStylesheet, CytoscapeLayout, ComponentSelection } from "./types/cytoscape"

// Extensions - using any type due to lack of proper TypeScript definitions
const fcose = require("cytoscape-fcose") as any
const klay = require("cytoscape-klay") as any

// Register Cytoscape extensions
cytoscape.use(fcose)
cytoscape.use(klay)

// Create main container
const div = document.body.appendChild(document.createElement("div"))
let args = ""
let currentCy: Core | null = null

/**
 * Updates the component value with currently selected nodes and edges
 */
function updateComponent(cy: Core): void {
  const selectedNodes = cy.$("node:selected")
  const selectedEdges = cy.$("edge:selected")
  
  const selection: ComponentSelection = {
    nodes: selectedNodes.map((node: NodeSingular) => node.id()),
    edges: selectedEdges.map((edge: EdgeSingular) => edge.id())
  }
  
  Streamlit.setComponentValue(selection)
}

/**
 * Generates theme-aware styles for the graph
 */
function generateThemeStyles(theme: Theme | undefined): CytoscapeStylesheet[] {
  if (!theme) return []
  
  const styles: CytoscapeStylesheet[] = []
  
  if (theme.primaryColor) {
    styles.push(
      {
        selector: "node:selected",
        style: {
          backgroundColor: theme.primaryColor,
          borderColor: theme.primaryColor,
          borderWidth: 2
        }
      },
      {
        selector: "edge:selected",
        style: {
          targetArrowColor: theme.primaryColor,
          lineColor: theme.primaryColor,
          width: 3
        }
      }
    )
  }
  
  if (theme.textColor || theme.font) {
    styles.push({
      selector: "node",
      style: {
        ...(theme.textColor && { color: theme.textColor }),
        ...(theme.font && { fontFamily: theme.font })
      }
    })
  }
  
  return styles
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  const data = (event as CustomEvent<RenderData>).detail
  const newArgs = JSON.stringify(data.args)
  
  // Only re-render if args have changed or no key is provided
  if (!data.args.key || args !== newArgs) {
    args = newArgs

    // Update container dimensions
    div.style.width = data.args.width as string
    div.style.height = data.args.height as string

    // Apply theme background
    if (data.theme?.backgroundColor) {
      div.style.background = data.theme.backgroundColor
    }

    // Generate theme-aware styles
    const themeStyles = generateThemeStyles(data.theme)
    const combinedStyles = [...(data.args.stylesheet as CytoscapeStylesheet[]), ...themeStyles]

    // Destroy existing instance
    if (currentCy) {
      currentCy.destroy()
    }

    // Create new Cytoscape instance
    currentCy = cytoscape({
      container: div,
      elements: data.args.elements as CytoscapeElement[],
      style: combinedStyles,
      layout: data.args.layout as CytoscapeLayout,
      selectionType: data.args.selectionType as "single" | "additive",
      userZoomingEnabled: data.args.userZoomingEnabled as boolean,
      userPanningEnabled: data.args.userPanningEnabled as boolean,
      minZoom: data.args.minZoom as number,
      maxZoom: data.args.maxZoom as number,
    })

    // Attach event listeners
    currentCy.on("select unselect", () => {
      if (currentCy) updateComponent(currentCy)
    })
    
    // Initial update
    updateComponent(currentCy)
  }

  Streamlit.setFrameHeight()
}

// Initialize component
function initializeComponent(): void {
  // Attach event listener
  Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
  
  // Tell Streamlit we're ready
  Streamlit.setComponentReady()
  
  // Set initial frame height
  Streamlit.setFrameHeight()
}

// Cleanup function for when component is destroyed
function cleanup(): void {
  if (currentCy) {
    currentCy.destroy()
    currentCy = null
  }
}

// Handle page unload
window.addEventListener('beforeunload', cleanup)

// Initialize the component
initializeComponent()
