import { Streamlit, RenderData } from "streamlit-component-lib"
import cytoscape, { Core } from "cytoscape"
import type {
  CytoscapeElement,
  CytoscapeStylesheet,
  CytoscapeLayout,
} from "./types/cytoscape"

// Extensions - using proper TypeScript imports
// @ts-ignore - TypeScript definitions provided in types/cytoscape.d.ts
import fcose from "cytoscape-fcose"
// @ts-ignore - TypeScript definitions provided in types/cytoscape.d.ts
import klay from "cytoscape-klay"

// Utility imports
import {
  createControlPanel,
  initializeControlPanel,
  cleanupControlPanel,
} from "./control-panel"
import {
  generateThemeStyles,
  applyContainerTheme,
  createFallbackTheme,
} from "./theme-utils"
import {
  setupKeyboardNavigation,
  cleanupKeyboardNavigation,
} from "./keyboard-utils"
import {
  createAccessibilityAnnouncer,
  announceSelection,
  setupContainerAccessibility,
  setupFocusStyling,
  cleanupAccessibilityListeners,
  cleanupAccessibilityAnnouncer,
} from "./accessibility-utils"
import { setupScrollProtection, cleanupScrollProtection } from "./scroll-utils"
import {
  createSelectionUpdater,
  createDebouncedSelectionHandler,
} from "./selection-utils"
import { setupResizeObserver, cleanupResizeObserver } from "./resize-utils"

// Register Cytoscape extensions
cytoscape.use(fcose)
cytoscape.use(klay)

// Use the root container for the component
const div = document.getElementById("root") || document.body.appendChild(document.createElement("div"))
div.style.position = "relative"
div.style.overflow = "hidden" // Prevent scroll issues
div.style.width = "100%"
div.style.height = "100%"
div.style.padding = "16px" // Add padding around the canvas
div.style.boxSizing = "border-box" // Include padding in dimensions

// Global state
let args = ""
let currentCy: Core | null = null
let isDestroyed = false
let resizeObserver: ResizeObserver | null = null
let selectedElementsAnnouncer: HTMLElement | null = null

// Create utilities
const updateSelection = createSelectionUpdater((nodes, edges) =>
  announceSelection(selectedElementsAnnouncer, nodes, edges)
)

/**
 * The component's render function
 */
function onRender(event: Event): void {
  try {
    const data = (event as CustomEvent<RenderData>).detail

    if (!data?.args) {
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
          applyContainerTheme(div, data.theme)
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
          selectedElementsAnnouncer = createAccessibilityAnnouncer(div)
        }

        // Update accessibility attributes
        const elements = data.args.elements as CytoscapeElement[]
        const nodeCount = elements.filter((e) => !e.data.source).length
        const edgeCount = elements.filter((e) => e.data.source).length
        setupContainerAccessibility(div, nodeCount, edgeCount)

        // Create new Cytoscape instance
        currentCy = cytoscape({
          container: div,
          elements,
          style: combinedStyles,
          layout: (data.args.layout as CytoscapeLayout) || { name: "grid" },
          selectionType:
            (data.args.selectionType as "single" | "additive") || "additive",
          userZoomingEnabled: data.args.wheelZoomEnabled === true ? (data.args.userZoomingEnabled !== false) : false,
          userPanningEnabled: data.args.userPanningEnabled !== false,
          minZoom: (data.args.minZoom as number) || 1e-50,
          maxZoom: (data.args.maxZoom as number) || 1e50,
        })

        // Setup debounced selection handling
        const handleSelectionChange = createDebouncedSelectionHandler(
          updateSelection,
          currentCy,
          () => isDestroyed
        )
        currentCy.on("select unselect", handleSelectionChange)

        // Setup all utilities
        setupKeyboardNavigation(
          currentCy,
          div,
          () => isDestroyed,
          (nodes, edges) =>
            announceSelection(selectedElementsAnnouncer, nodes, edges)
        )
        setupScrollProtection(div)
        setupFocusStyling(div, () => isDestroyed)

        // Extract current layout name and initialize control panel
        const layoutConfig = data.args.layout as CytoscapeLayout
        const currentLayoutName =
          layoutConfig &&
          typeof layoutConfig === "object" &&
          "name" in layoutConfig
            ? layoutConfig.name || "fcose"
            : "fcose"

        initializeControlPanel(currentCy, currentLayoutName, elements, combinedStyles)
        createControlPanel(div, data.theme || createFallbackTheme())

        // Setup resize observer
        resizeObserver = setupResizeObserver(div, currentCy, () => isDestroyed)

        // Note: No initial update - only send values on user interactions
        // The default value is handled by the Python component declaration
      } catch (renderError) {
        console.error("Error during component render:", renderError)
        showErrorFallback()
      }
    }

    Streamlit.setFrameHeight()
  } catch (error) {
    console.error("Critical error in onRender:", error)
  }
}

/**
 * Shows error fallback UI
 */
function showErrorFallback(): void {
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

/**
 * Initialize component
 */
function initializeComponent(): void {
  try {
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
    Streamlit.setComponentReady()
    Streamlit.setFrameHeight()
  } catch (error) {
    console.error("Error initializing component:", error)
  }
}

/**
 * Comprehensive cleanup function
 */
function cleanup(): void {
  try {
    isDestroyed = true
    cleanupResizeObserver(resizeObserver)
    destroyComponent()
    cleanupAccessibilityAnnouncer(selectedElementsAnnouncer)
    cleanupKeyboardNavigation(div)
    cleanupScrollProtection(div)
    cleanupAccessibilityListeners(div)

    // Clean up DOM
    if (div && div.parentNode) {
      div.innerHTML = ""
      div.parentNode.removeChild(div)
    }

    window.removeEventListener("beforeunload", cleanup)
  } catch (error) {
    console.error("Error during component cleanup:", error)
  }
}

/**
 * Destroy Cytoscape component
 */
function destroyComponent(): void {
  try {
    isDestroyed = true
    cleanupResizeObserver(resizeObserver)

    if (currentCy) {
      currentCy.removeAllListeners()
      currentCy.destroy()
      currentCy = null
    }

    cleanupControlPanel()
    cleanupAccessibilityAnnouncer(selectedElementsAnnouncer)
    selectedElementsAnnouncer = null
  } catch (error) {
    console.error("Error destroying component:", error)
  }
}

// Setup lifecycle
window.addEventListener("beforeunload", cleanup)

// Initialize the component
try {
  initializeComponent()
} catch (error) {
  console.error("Failed to initialize Cytoscape component:", error)
}

