/**
 * Application constants and configuration
 */

// Timing constants
export const DEBOUNCE_DELAY = 100
export const KEYBOARD_ANNOUNCEMENT_DELAY = 100
export const RESIZE_DEBOUNCE_DELAY = 100

// Layout constants
export const AVAILABLE_LAYOUTS = [
  { name: "fcose", label: "Force" },
  { name: "klay", label: "Hierarchical" },
  { name: "cose", label: "CoSE" },
  { name: "circle", label: "Circle" },
  { name: "grid", label: "Grid" },
] as const

// Default layout configurations
export const DEFAULT_LAYOUT_OPTIONS = {
  fcose: {
    quality: "default",
    randomize: false,
    animate: true,
  },
  klay: {
    direction: "DOWN",
    spacing: 20,
  },
  circle: {
    // radius calculated dynamically
  },
  grid: {
    // rows calculated dynamically
  },
} as const

// UI constants
export const CONTROL_PANEL = {
  POSITION: {
    TOP: "0px",
    RIGHT: "0px", 
    Z_INDEX: "1000",
  },
  STYLING: {
    PADDING: "12px",
    GAP: "8px",
    BORDER_RADIUS: "8px",
    BOX_SHADOW: "0 2px 8px rgba(0,0,0,0.15)",
  },
  BUTTON: {
    PADDING: "6px 10px",
    FONT_SIZE: "12px",
    BORDER_RADIUS: "4px",
    TRANSITION: "all 0.2s ease",
  },
  LABEL: {
    FONT_SIZE: "11px",
    FONT_WEIGHT: "600",
    OPACITY: "0.7",
    LETTER_SPACING: "0.5px",
  },
} as const

// Zoom constants
export const ZOOM = {
  IN_FACTOR: 1.2,
  OUT_FACTOR: 0.8,
} as const

// Animation constants
export const ANIMATION = {
  DEFAULT_DURATION: 500,
  LAYOUT_DURATION: 500,
} as const

// Theme constants
export const THEME = {
  DARK: {
    BACKGROUND: "rgba(38, 39, 48, 0.95)",
    BORDER: "1px solid rgba(250, 250, 250, 0.2)",
    BUTTON_BG: "rgba(250, 250, 250, 0.1)",
    BUTTON_BORDER: "rgba(250, 250, 250, 0.2)",
  },
  LIGHT: {
    BACKGROUND: "rgba(255, 255, 255, 0.95)",
    BORDER: "1px solid rgba(0, 0, 0, 0.1)",
    BUTTON_BG: "rgba(0, 0, 0, 0.05)",
    BUTTON_BORDER: "rgba(0, 0, 0, 0.1)",
  },
  FALLBACK: {
    PRIMARY_COLOR: "#ff4b4b",
    BACKGROUND: "#ffffff",
    SECONDARY_BACKGROUND: "#f0f2f6",
    TEXT_COLOR: "#000000",
    FONT: "sans-serif",
  },
} as const

// Accessibility constants
export const ACCESSIBILITY = {
  ANNOUNCER: {
    POSITION: "absolute",
    LEFT: "-10000px",
    WIDTH: "1px",
    HEIGHT: "1px",
    OVERFLOW: "hidden",
  },
} as const

