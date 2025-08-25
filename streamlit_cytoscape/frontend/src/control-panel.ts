/**
 * Control panel utilities and creation functions
 */

import type { Theme } from "streamlit-component-lib"
import type { Core } from "cytoscape"
import {
  AVAILABLE_LAYOUTS,
  CONTROL_PANEL,
  ZOOM,
  ANIMATION,
  DEFAULT_LAYOUT_OPTIONS,
} from "./constants"
import { getPanelStyles, getButtonStyles } from "./theme-utils"

// Global references for control functionality
let currentCy: Core | null = null
let currentLayoutName = "fcose"
let controlPanel: HTMLElement | null = null
let currentElements: any[] = []
let currentStylesheet: any[] = []

/**
 * Initialize control panel state
 */
export function initializeControlPanel(
  cy: Core, 
  layoutName = "fcose", 
  elements: any[] = [], 
  stylesheet: any[] = []
): void {
  currentCy = cy
  currentLayoutName = layoutName
  currentElements = elements
  currentStylesheet = stylesheet
}

/**
 * Creates the main control panel
 */
export function createControlPanel(
  container: HTMLElement,
  theme: Theme
): HTMLElement {
  const panel = document.createElement("div")
  panel.className = "cytoscape-controls"

  // Apply positioning and base styles
  Object.assign(panel.style, {
    position: "absolute",
    top: CONTROL_PANEL.POSITION.TOP,
    right: CONTROL_PANEL.POSITION.RIGHT,
    zIndex: CONTROL_PANEL.POSITION.Z_INDEX,
    display: "flex",
    flexDirection: "column",
    gap: CONTROL_PANEL.STYLING.GAP,
    padding: CONTROL_PANEL.STYLING.PADDING,
    borderRadius: CONTROL_PANEL.STYLING.BORDER_RADIUS,
    boxShadow: CONTROL_PANEL.STYLING.BOX_SHADOW,
    userSelect: "none",
    ...getPanelStyles(theme),
  })

  // Create button groups
  const layoutGroup = createButtonGroup("Layout", theme)
  const zoomExportGroup = createButtonGroup("Zoom & Export", theme)
  const legendGroup = createLegendGroup("Legend", theme)

  // Add layout buttons with enhanced styling
  AVAILABLE_LAYOUTS.forEach((layout) => {
    const btn = createControlButton(
      layout.label,
      theme,
      layout.name === currentLayoutName
    )
    btn.onclick = () => switchLayout(layout.name)
    btn.setAttribute("data-layout", layout.name)
    btn.setAttribute(
      "aria-pressed",
      (layout.name === currentLayoutName).toString()
    )
    btn.title = `Switch to ${layout.label} layout`
    btn.style.minHeight = "28px"
    btn.style.display = "flex"
    btn.style.alignItems = "center"
    btn.style.justifyContent = "center"
    btn.style.lineHeight = "1"
    getButtonContainer(layoutGroup).appendChild(btn)
  })

  // Add reset button with enhanced styling
  const resetBtn = createControlButton("Reset View", theme)
  resetBtn.onclick = resetView
  resetBtn.title = "Reset graph position and re-apply current layout"
  resetBtn.style.fontWeight = "600"
  resetBtn.style.borderStyle = "dashed"
  resetBtn.style.minHeight = "28px"
  resetBtn.style.display = "flex"
  resetBtn.style.alignItems = "center"
  resetBtn.style.justifyContent = "center"
  resetBtn.style.lineHeight = "1"
  getButtonContainer(layoutGroup).appendChild(resetBtn)

  // Add zoom buttons with enhanced tooltips
  const zoomButtons = [
    { text: "+", handler: zoomIn, title: "Zoom in" },
    { text: "-", handler: zoomOut, title: "Zoom out" },
    { text: "=", handler: fitToView, title: "Fit to view" },
  ]

  // Add zoom and export buttons in the same row
  const zoomExportContainer = getButtonContainer(zoomExportGroup)

  // Add zoom buttons
  zoomButtons.forEach(({ text, handler, title }) => {
    const btn = createControlButton(text, theme)
    btn.onclick = handler
    btn.title = title
    btn.style.fontFamily = "monospace"
    btn.style.fontSize = "12px"
    btn.style.lineHeight = "1"
    btn.style.minHeight = "28px"
    btn.style.display = "flex"
    btn.style.alignItems = "center"
    btn.style.justifyContent = "center"
    zoomExportContainer.appendChild(btn)
  })

  // Add a visual separator
  const separator = document.createElement("div")
  separator.style.width = "1px"
  separator.style.height = "24px"
  separator.style.backgroundColor = theme.textColor
  separator.style.opacity = "0.2"
  separator.style.margin = "0 4px"
  zoomExportContainer.appendChild(separator)

  // Add export buttons
  const exportButtons = [
    { text: "PNG", handler: exportPNG, title: "Export as PNG image" },
    { text: "SVG", handler: exportSVG, title: "Export as SVG vector" },
  ]

  exportButtons.forEach(({ text, handler, title }) => {
    const btn = createControlButton(text, theme)
    btn.onclick = handler
    btn.title = title
    btn.style.fontFamily = "monospace"
    btn.style.fontSize = "11px"
    btn.style.fontWeight = "600"
    btn.style.lineHeight = "1"
    btn.style.minHeight = "28px"
    btn.style.display = "flex"
    btn.style.alignItems = "center"
    btn.style.justifyContent = "center"
    zoomExportContainer.appendChild(btn)
  })

  panel.appendChild(layoutGroup)
  panel.appendChild(zoomExportGroup)
  panel.appendChild(legendGroup)
  container.appendChild(panel)

  controlPanel = panel
  return panel
}

/**
 * Creates a button group container
 */
function createButtonGroup(title: string, theme: Theme): HTMLElement {
  const group = document.createElement("div")
  Object.assign(group.style, {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  })

  const label = document.createElement("div")
  label.textContent = title
  Object.assign(label.style, {
    fontSize: CONTROL_PANEL.LABEL.FONT_SIZE,
    fontWeight: CONTROL_PANEL.LABEL.FONT_WEIGHT,
    color: theme.textColor,
    opacity: CONTROL_PANEL.LABEL.OPACITY,
    textTransform: "uppercase",
    letterSpacing: CONTROL_PANEL.LABEL.LETTER_SPACING,
  })

  const buttonContainer = document.createElement("div")
  Object.assign(buttonContainer.style, {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
  })

  group.appendChild(label)
  group.appendChild(buttonContainer)

  // Store reference to button container
  ;(group as any).buttonContainer = buttonContainer

  return group
}

/**
 * Creates a legend group container
 */
function createLegendGroup(title: string, theme: Theme): HTMLElement {
  const group = document.createElement("div")
  Object.assign(group.style, {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  })

  const label = document.createElement("div")
  label.textContent = title
  Object.assign(label.style, {
    fontSize: CONTROL_PANEL.LABEL.FONT_SIZE,
    fontWeight: CONTROL_PANEL.LABEL.FONT_WEIGHT,
    color: theme.textColor,
    opacity: CONTROL_PANEL.LABEL.OPACITY,
    textTransform: "uppercase",
    letterSpacing: CONTROL_PANEL.LABEL.LETTER_SPACING,
  })

  const legendContainer = document.createElement("div")
  Object.assign(legendContainer.style, {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    maxHeight: "120px",
    overflowY: "auto",
  })

  // Generate legend items
  const legendItems = generateLegendItems(theme)
  legendItems.forEach(item => legendContainer.appendChild(item))

  group.appendChild(label)
  group.appendChild(legendContainer)

  // Store reference to legend container
  ;(group as any).legendContainer = legendContainer

  return group
}

/**
 * Creates a styled control button
 */
function createControlButton(
  text: string,
  theme: Theme,
  isActive = false
): HTMLButtonElement {
  const button = document.createElement("button")
  button.textContent = text

  Object.assign(button.style, {
    padding: CONTROL_PANEL.BUTTON.PADDING,
    fontSize: CONTROL_PANEL.BUTTON.FONT_SIZE,
    fontWeight: "500",
    border: "1px solid",
    borderRadius: CONTROL_PANEL.BUTTON.BORDER_RADIUS,
    cursor: "pointer",
    transition: CONTROL_PANEL.BUTTON.TRANSITION,
    whiteSpace: "nowrap",
    ...getButtonStyles(theme, isActive),
  })

  // Add hover effects
  const originalStyles = getButtonStyles(theme, isActive)
  const hoverStyles = getButtonStyles(theme, true)

  button.addEventListener("mouseenter", () => {
    Object.assign(button.style, hoverStyles)
  })

  button.addEventListener("mouseleave", () => {
    if (!isCurrentLayoutButton(button.textContent)) {
      Object.assign(button.style, originalStyles)
    }
  })

  return button
}

/**
 * Switches to a different layout
 */
function switchLayout(layoutName: string): void {
  if (!currentCy || layoutName === currentLayoutName) return

  // Update current layout state
  currentLayoutName = layoutName

  // Get layout-specific options
  const layoutOptions = {
    name: layoutName,
    animate: true,
    animationDuration: ANIMATION.LAYOUT_DURATION,
    ...getLayoutSpecificOptions(layoutName),
  }

  // Apply new layout
  const layout = currentCy.layout(layoutOptions)
  layout.run()

  // Update button visual states immediately
  updateLayoutButtons()

  // Announce layout change for accessibility
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "polite")
  announcement.style.cssText =
    "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;"
  announcement.textContent = `Layout changed to ${AVAILABLE_LAYOUTS.find((l) => l.name === layoutName)?.label || layoutName}`
  document.body.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Gets layout-specific options
 */
function getLayoutSpecificOptions(layoutName: string) {
  switch (layoutName) {
    case "fcose":
      return DEFAULT_LAYOUT_OPTIONS.fcose
    case "klay":
      return DEFAULT_LAYOUT_OPTIONS.klay
    case "circle":
      return currentCy
        ? {
            radius: Math.min(currentCy.width(), currentCy.height()) / 3,
          }
        : {}
    case "grid":
      return currentCy
        ? {
            rows: Math.ceil(Math.sqrt(currentCy.nodes().length)),
          }
        : {}
    default:
      return {}
  }
}

/**
 * Updates layout button visual states
 */
function updateLayoutButtons(): void {
  if (!controlPanel) return

  const theme = getCurrentTheme()

  controlPanel.querySelectorAll("button[data-layout]").forEach((btn) => {
    const button = btn as HTMLButtonElement
    const layoutName = button.getAttribute("data-layout")
    const isCurrentLayout = layoutName === currentLayoutName

    // Update visual state
    Object.assign(button.style, getButtonStyles(theme, isCurrentLayout))

    // Update accessibility attributes
    button.setAttribute("aria-pressed", isCurrentLayout.toString())

    // Add enhanced visual feedback for current layout
    if (isCurrentLayout) {
      button.style.fontWeight = "600"
      button.style.transform = "translateY(-1px)"
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
    } else {
      button.style.fontWeight = "500"
      button.style.transform = "none"
      button.style.boxShadow = "none"
    }
  })
}

/**
 * Resets the view and layout
 */
function resetView(): void {
  if (!currentCy) return

  // Reset zoom and center the view
  currentCy.fit()
  currentCy.center()

  // Re-apply current layout with animation
  const layoutOptions = {
    name: currentLayoutName,
    animate: true,
    animationDuration: ANIMATION.LAYOUT_DURATION,
    ...getLayoutSpecificOptions(currentLayoutName),
  }
  const layout = currentCy.layout(layoutOptions)
  layout.run()

  // Announce reset for accessibility
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "polite")
  announcement.style.cssText =
    "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;"
  announcement.textContent = "Graph view reset and layout refreshed"
  document.body.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Zooms in the graph
 */
function zoomIn(): void {
  if (!currentCy) return

  // Temporarily enable zooming if disabled, then restore
  const wasZoomingEnabled = currentCy.userZoomingEnabled()
  if (!wasZoomingEnabled) {
    currentCy.userZoomingEnabled(true)
  }

  currentCy.zoom({
    level: currentCy.zoom() * ZOOM.IN_FACTOR,
    renderedPosition: {
      x: currentCy.width() / 2,
      y: currentCy.height() / 2,
    },
  })

  // Restore original zooming state
  if (!wasZoomingEnabled) {
    currentCy.userZoomingEnabled(false)
  }
}

/**
 * Zooms out the graph
 */
function zoomOut(): void {
  if (!currentCy) return

  // Temporarily enable zooming if disabled, then restore
  const wasZoomingEnabled = currentCy.userZoomingEnabled()
  if (!wasZoomingEnabled) {
    currentCy.userZoomingEnabled(true)
  }

  currentCy.zoom({
    level: currentCy.zoom() * ZOOM.OUT_FACTOR,
    renderedPosition: {
      x: currentCy.width() / 2,
      y: currentCy.height() / 2,
    },
  })

  // Restore original zooming state
  if (!wasZoomingEnabled) {
    currentCy.userZoomingEnabled(false)
  }
}

/**
 * Fits the graph to the view
 */
function fitToView(): void {
  if (!currentCy) return

  // Temporarily enable zooming if disabled, then restore
  const wasZoomingEnabled = currentCy.userZoomingEnabled()
  if (!wasZoomingEnabled) {
    currentCy.userZoomingEnabled(true)
  }

  currentCy.fit()

  // Restore original zooming state
  if (!wasZoomingEnabled) {
    currentCy.userZoomingEnabled(false)
  }
}

/**
 * Exports the graph as PNG image
 */
function exportPNG(): void {
  if (!currentCy) return

  try {
    // Generate PNG with high quality
    const pngDataUrl = currentCy.png({
      output: "blob-promise",
      bg: "white",
      full: true,
      scale: 2, // Higher resolution
    })

    pngDataUrl
      .then((blob: Blob) => {
        downloadFile(blob, "cytoscape-graph.png")
        announceExport("PNG")
      })
      .catch((error: Error) => {
        console.error("PNG export failed:", error)
        announceExportError("PNG")
      })
  } catch (error) {
    console.error("PNG export error:", error)
    announceExportError("PNG")
  }
}

/**
 * Exports the graph as SVG vector
 */
function exportSVG(): void {
  if (!currentCy) return

  try {
    // Generate SVG - use type assertion for svg method
    const svgContent = (currentCy as any).svg({
      full: true,
      bg: "white",
    })

    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    downloadFile(blob, "cytoscape-graph.svg")
    announceExport("SVG")
  } catch (error) {
    console.error("SVG export error:", error)
    announceExportError("SVG")
  }
}

/**
 * Downloads a file to the user's device
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Announces successful export for accessibility
 */
function announceExport(format: string): void {
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "polite")
  announcement.style.cssText =
    "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;"
  announcement.textContent = `Graph exported as ${format} file`
  document.body.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Announces export error for accessibility
 */
function announceExportError(format: string): void {
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "assertive")
  announcement.style.cssText =
    "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;"
  announcement.textContent = `Failed to export graph as ${format}`
  document.body.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 2000)
}

/**
 * Generates legend items based on node labels and styles
 */
function generateLegendItems(theme: Theme): HTMLElement[] {
  const items: HTMLElement[] = []
  
  // Extract unique node labels
  const nodeLabels = extractUniqueNodeLabels()
  
  if (nodeLabels.length === 0) {
    return items
  }

  nodeLabels.forEach(labelInfo => {
    const item = createLegendItem(labelInfo, theme)
    items.push(item)
  })

  return items
}

/**
 * Extracts unique node labels from current elements
 */
function extractUniqueNodeLabels(): Array<{label: string, color: string, shape?: string}> {
  const labelMap = new Map<string, {label: string, color: string, shape?: string}>()
  
  // Get nodes from elements
  const nodes = currentElements.filter(el => !el.data.source && !el.data.target)
  
  nodes.forEach(node => {
    const label = node.data.label || node.data.id || 'Unknown'
    
    if (!labelMap.has(label)) {
      // Find style for this node
      const style = findStyleForNode(node)
      labelMap.set(label, {
        label,
        color: style.color || '#666',
        shape: style.shape || 'ellipse'
      })
    }
  })

  return Array.from(labelMap.values())
}

/**
 * Finds style for a specific node from stylesheet
 */
function findStyleForNode(node: any): {color: string, shape?: string} {
  let nodeStyle = {
    color: '#ff6b6b', // default color
    shape: 'ellipse'
  }

  // Look through stylesheet for matching selectors
  for (const styleRule of currentStylesheet) {
    if (styleRule.selector === 'node' || 
        (styleRule.selector.includes('.') && node.classes && 
         node.classes.some((cls: string) => styleRule.selector.includes(`.${cls}`))) ||
        (styleRule.selector.includes('#') && styleRule.selector.includes(`#${node.data.id}`))) {
      
      if (styleRule.style['background-color']) {
        nodeStyle.color = styleRule.style['background-color']
      }
      if (styleRule.style.shape) {
        nodeStyle.shape = styleRule.style.shape
      }
    }
  }

  return nodeStyle
}

/**
 * Creates a single legend item
 */
function createLegendItem(
  labelInfo: {label: string, color: string, shape?: string}, 
  theme: Theme
): HTMLElement {
  const item = document.createElement("div")
  Object.assign(item.style, {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: theme.textColor,
    padding: "2px 0",
  })

  // Create visual indicator (colored circle)
  const indicator = document.createElement("div")
  Object.assign(indicator.style, {
    width: "12px",
    height: "12px",
    borderRadius: labelInfo.shape === 'rectangle' ? "2px" : "50%",
    backgroundColor: labelInfo.color,
    flexShrink: "0",
    border: "1px solid rgba(0,0,0,0.1)",
  })

  // Create label text
  const text = document.createElement("span")
  text.textContent = labelInfo.label
  text.style.overflow = "hidden"
  text.style.textOverflow = "ellipsis"
  text.style.whiteSpace = "nowrap"

  item.appendChild(indicator)
  item.appendChild(text)

  return item
}

/**
 * Cleanup control panel references
 */
export function cleanupControlPanel(): void {
  if (controlPanel && controlPanel.parentNode) {
    controlPanel.parentNode.removeChild(controlPanel)
  }
  controlPanel = null
  currentCy = null
  currentElements = []
  currentStylesheet = []
}

// Helper functions
function getButtonContainer(group: HTMLElement): HTMLElement {
  return (group as any).buttonContainer
}

function isCurrentLayoutButton(buttonText: string | null): boolean {
  return AVAILABLE_LAYOUTS.some(
    (layout) => layout.label === buttonText && layout.name === currentLayoutName
  )
}

function getCurrentTheme(): Theme {
  return (
    (window as any).__streamlit_theme || {
      primaryColor: "#ff4b4b",
      textColor: "#000000",
      base: "light",
    }
  )
}
