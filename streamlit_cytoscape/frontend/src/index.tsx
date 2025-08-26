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
const div =
  document.getElementById("root") ||
  document.body.appendChild(document.createElement("div"))
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

        // Validate required data with specific error messages
        if (!data.args.elements) {
          throw new Error(
            "Missing 'elements' parameter. Please provide a list of nodes and edges."
          )
        }
        if (!Array.isArray(data.args.elements)) {
          throw new Error(
            `Invalid 'elements' parameter type: expected array, got ${typeof data.args.elements}. Please provide a list of nodes and edges.`
          )
        }
        if (data.args.elements.length === 0) {
          throw new Error(
            "Empty 'elements' array. Please provide at least one node or edge."
          )
        }

        // Validate elements structure
        const invalidElementIndices: number[] = []
        data.args.elements.forEach((el: any, idx: number) => {
          if (
            !el ||
            typeof el !== "object" ||
            !el.data ||
            typeof el.data !== "object"
          ) {
            invalidElementIndices.push(idx)
          }
        })
        if (invalidElementIndices.length > 0) {
          throw new Error(
            `Invalid element structure found. Each element must have a 'data' object. Check elements at positions: ${invalidElementIndices.join(", ")}`
          )
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

        // Create new Cytoscape instance with error handling
        try {
          currentCy = cytoscape({
            container: div,
            elements,
            style: combinedStyles,
            layout: (data.args.layout as CytoscapeLayout) || { name: "grid" },
            selectionType:
              (data.args.selectionType as "single" | "additive") || "additive",
            userZoomingEnabled:
              data.args.wheelZoomEnabled === true
                ? data.args.userZoomingEnabled !== false
                : false,
            userPanningEnabled: data.args.userPanningEnabled !== false,
            minZoom: (data.args.minZoom as number) || 1e-50,
            maxZoom: (data.args.maxZoom as number) || 1e50,
          })
        } catch (cytoscapeError) {
          console.error("Cytoscape initialization error:", cytoscapeError)
          throw new Error(
            `Failed to create Cytoscape graph: ${cytoscapeError instanceof Error ? cytoscapeError.message : String(cytoscapeError)}. This may be caused by invalid elements, stylesheet, or layout configuration.`
          )
        }

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

        initializeControlPanel(
          currentCy,
          currentLayoutName,
          elements,
          combinedStyles
        )
        createControlPanel(div, data.theme || createFallbackTheme())

        // Setup resize observer
        resizeObserver = setupResizeObserver(div, currentCy, () => isDestroyed)

        // Note: No initial update - only send values on user interactions
        // The default value is handled by the Python component declaration
      } catch (renderError) {
        console.error("Error during component render:", renderError)
        showErrorFallback(renderError, "Component rendering")
      }
    }

    Streamlit.setFrameHeight()
  } catch (error) {
    console.error("Critical error in onRender:", error)
    showErrorFallback(error, "Critical render failure")
  }
}

/**
 * Fallback copy method using textarea selection
 */
function fallbackCopy(text: string, button: HTMLButtonElement): void {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    
    textarea.focus()
    textarea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    
    if (successful) {
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = button.textContent.includes('Stack') ? 'Copy Stack' : 'Copy Error'
      }, 2000)
    } else {
      button.textContent = 'Copy failed'
      setTimeout(() => {
        button.textContent = button.textContent.includes('Stack') ? 'Copy Stack' : 'Copy Error'
      }, 2000)
    }
  } catch (err) {
    button.textContent = 'Copy failed'
    setTimeout(() => {
      button.textContent = button.textContent.includes('Stack') ? 'Copy Stack' : 'Copy Error'
    }, 2000)
  }
}

/**
 * Shows error fallback UI with detailed error information
 */
function showErrorFallback(error?: Error | any, context?: string): void {
  let errorDetails = "Unknown error occurred"
  let errorStack = ""

  if (error) {
    if (error instanceof Error) {
      errorDetails = error.message || errorDetails
      errorStack = error.stack || ""
    } else if (typeof error === "string") {
      errorDetails = error
    } else {
      errorDetails = JSON.stringify(error, null, 2)
    }
  }


  const errorContainer = document.createElement('div')
  errorContainer.style.cssText = `
    display: flex; 
    align-items: center; 
    justify-content: center; 
    height: 100%; 
    color: #333; 
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    margin: 10px;
  `
  
  const contentDiv = document.createElement('div')
  contentDiv.style.maxWidth = '600px'
  
  const title = document.createElement('p')
  title.style.cssText = 'font-size: 16px; margin-bottom: 15px;'
  title.innerHTML = '⚠️ <strong>Graph Rendering Error</strong>'
  contentDiv.appendChild(title)
  
  if (context) {
    const contextEl = document.createElement('p')
    contextEl.innerHTML = `<strong>Context:</strong> ${context}`
    contentDiv.appendChild(contextEl)
  }
  
  const errorBox = document.createElement('div')
  errorBox.style.cssText = `
    background: #fff; 
    padding: 10px; 
    border-radius: 4px; 
    border: 1px solid #ddd; 
    font-family: monospace; 
    font-size: 12px;
    text-align: left;
    margin: 10px 0;
    word-break: break-word;
    position: relative;
  `
  
  const errorText = document.createElement('div')
  errorText.innerHTML = `<strong>Error:</strong> ${errorDetails}`
  errorText.style.userSelect = 'text'
  errorText.style.cursor = 'text'
  errorBox.appendChild(errorText)
  
  const copyButton = document.createElement('button')
  copyButton.textContent = 'Copy Error'
  copyButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 4px 8px;
    font-size: 10px;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
  `
  copyButton.onclick = () => {
    const errorInfo = context 
      ? `Context: ${context}\nError: ${errorDetails}${errorStack ? '\n\nStack trace:\n' + errorStack : ''}`
      : `Error: ${errorDetails}${errorStack ? '\n\nStack trace:\n' + errorStack : ''}`
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(errorInfo).then(() => {
        copyButton.textContent = 'Copied!'
        setTimeout(() => copyButton.textContent = 'Copy Error', 2000)
      }).catch(() => {
        fallbackCopy(errorInfo, copyButton)
      })
    } else {
      fallbackCopy(errorInfo, copyButton)
    }
  }
  errorBox.appendChild(copyButton)
  contentDiv.appendChild(errorBox)
  
  if (errorStack) {
    const details = document.createElement('details')
    details.style.cssText = 'margin-top: 10px; text-align: left;'
    
    const summary = document.createElement('summary')
    summary.style.cssText = 'cursor: pointer; font-weight: bold;'
    summary.textContent = 'Show stack trace'
    details.appendChild(summary)
    
    const pre = document.createElement('pre')
    pre.style.cssText = `
      background: #f5f5f5; 
      padding: 10px; 
      border-radius: 4px; 
      overflow-x: auto; 
      font-size: 11px; 
      margin-top: 5px;
      max-height: 200px;
      overflow-y: auto;
      user-select: text;
      cursor: text;
      position: relative;
    `
    pre.textContent = errorStack
    
    const stackCopyButton = document.createElement('button')
    stackCopyButton.textContent = 'Copy Stack'
    stackCopyButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 4px 8px;
      font-size: 10px;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 3px;
      cursor: pointer;
    `
    stackCopyButton.onclick = () => {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(errorStack).then(() => {
          stackCopyButton.textContent = 'Copied!'
          setTimeout(() => stackCopyButton.textContent = 'Copy Stack', 2000)
        }).catch(() => {
          fallbackCopy(errorStack, stackCopyButton)
        })
      } else {
        fallbackCopy(errorStack, stackCopyButton)
      }
    }
    pre.appendChild(stackCopyButton)
    details.appendChild(pre)
    contentDiv.appendChild(details)
  }
  
  const note = document.createElement('p')
  note.style.cssText = 'font-size: 12px; color: #666; margin-top: 15px;'
  note.textContent = 'This error information can be shared with developers for debugging.'
  contentDiv.appendChild(note)
  
  errorContainer.appendChild(contentDiv)
  div.innerHTML = ''
  div.appendChild(errorContainer)
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
    showErrorFallback(error, "Component initialization")
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
  showErrorFallback(error, "Component startup")
}
