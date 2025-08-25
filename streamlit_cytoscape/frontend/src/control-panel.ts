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

/**
 * Initialize control panel state
 */
export function initializeControlPanel(cy: Core, layoutName = "fcose"): void {
  currentCy = cy
  currentLayoutName = layoutName
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
  const zoomGroup = createButtonGroup("Zoom", theme)

  // Add layout buttons
  AVAILABLE_LAYOUTS.forEach((layout) => {
    const btn = createControlButton(
      layout.label,
      theme,
      layout.name === currentLayoutName
    )
    btn.onclick = () => switchLayout(layout.name)
    getButtonContainer(layoutGroup).appendChild(btn)
  })

  // Add reset button
  const resetBtn = createControlButton("Reset", theme)
  resetBtn.onclick = resetView
  getButtonContainer(layoutGroup).appendChild(resetBtn)

  // Add zoom buttons
  const zoomButtons = [
    { text: "➕", handler: zoomIn },
    { text: "➖", handler: zoomOut },
    { text: "⊡", handler: fitToView },
  ]

  const zoomContainer = getButtonContainer(zoomGroup)
  zoomButtons.forEach(({ text, handler }) => {
    const btn = createControlButton(text, theme)
    btn.onclick = handler
    zoomContainer.appendChild(btn)
  })

  panel.appendChild(layoutGroup)
  panel.appendChild(zoomGroup)
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
  if (!currentCy) return

  currentLayoutName = layoutName

  const layoutOptions = {
    name: layoutName,
    animate: true,
    animationDuration: ANIMATION.LAYOUT_DURATION,
    ...getLayoutSpecificOptions(layoutName),
  }

  const layout = currentCy.layout(layoutOptions)
  layout.run()

  updateLayoutButtons()
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

  controlPanel.querySelectorAll("button").forEach((btn) => {
    const isCurrentLayout = isCurrentLayoutButton(btn.textContent)
    if (isCurrentLayout) {
      const theme = getCurrentTheme()
      Object.assign(btn.style, getButtonStyles(theme, true))
    }
  })
}

/**
 * Resets the view and layout
 */
function resetView(): void {
  if (!currentCy) return

  currentCy.fit()
  currentCy.center()

  const layoutOptions = {
    name: currentLayoutName,
    animate: true,
    animationDuration: ANIMATION.LAYOUT_DURATION,
  }
  const layout = currentCy.layout(layoutOptions)
  layout.run()
}

/**
 * Zooms in the graph
 */
function zoomIn(): void {
  if (!currentCy) return

  currentCy.zoom({
    level: currentCy.zoom() * ZOOM.IN_FACTOR,
    renderedPosition: {
      x: currentCy.width() / 2,
      y: currentCy.height() / 2,
    },
  })
}

/**
 * Zooms out the graph
 */
function zoomOut(): void {
  if (!currentCy) return

  currentCy.zoom({
    level: currentCy.zoom() * ZOOM.OUT_FACTOR,
    renderedPosition: {
      x: currentCy.width() / 2,
      y: currentCy.height() / 2,
    },
  })
}

/**
 * Fits the graph to the view
 */
function fitToView(): void {
  if (!currentCy) return
  currentCy.fit()
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

