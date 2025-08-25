/**
 * Theme-related utilities and styles generation
 */

import type { Theme } from "streamlit-component-lib"
import type { CytoscapeStylesheet } from "./types/cytoscape"
import { THEME } from "./constants"

/**
 * Generates theme-aware styles for the graph
 */
export function generateThemeStyles(theme?: Theme): CytoscapeStylesheet[] {
  if (!theme) return []

  const styles: CytoscapeStylesheet[] = []
  const isDark = theme.base === "dark"

  // Base node styles with theme colors
  const baseNodeStyle = {
    ...(theme.textColor && { color: theme.textColor }),
    ...(theme.font && { fontFamily: theme.font }),
    ...(theme.secondaryBackgroundColor &&
      isDark && {
        backgroundColor: theme.secondaryBackgroundColor,
        borderColor: theme.textColor || "#666",
        borderWidth: 1,
      }),
  }

  if (Object.keys(baseNodeStyle).length > 0) {
    styles.push({ selector: "node", style: baseNodeStyle })
  }

  // Selection styles with primary color
  if (theme.primaryColor) {
    styles.push(
      {
        selector: "node:selected",
        style: {
          backgroundColor: theme.primaryColor,
          borderColor: theme.primaryColor,
          borderWidth: 3,
          boxShadow: `0 0 10px ${theme.primaryColor}40`,
          color: isDark ? "#ffffff" : theme.textColor || "#000000",
        },
      },
      {
        selector: "edge:selected",
        style: {
          targetArrowColor: theme.primaryColor,
          sourceArrowColor: theme.primaryColor,
          lineColor: theme.primaryColor,
          width: 4,
          shadowColor: theme.primaryColor,
          shadowBlur: 8,
          shadowOpacity: 0.3,
        },
      }
    )
  }

  // Base edge styles
  if (theme.textColor) {
    styles.push({
      selector: "edge",
      style: {
        lineColor: isDark ? "#666" : "#ccc",
        targetArrowColor: isDark ? "#666" : "#ccc",
        sourceArrowColor: isDark ? "#666" : "#ccc",
      },
    })
  }

  // Hover styles
  if (theme.primaryColor) {
    styles.push(
      {
        selector: "node:active",
        style: {
          backgroundColor: theme.primaryColor + "CC",
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
          "text-outline-color": isDark ? "#000000" : "#ffffff",
          "text-outline-width": 1,
        }),
        ...(theme.font && { fontFamily: theme.font }),
        fontSize: "12px",
        fontWeight: "500",
      },
    })
  }

  return styles
}

/**
 * Applies container theme styles
 */
export function applyContainerTheme(
  container: HTMLElement,
  theme?: Theme
): void {
  if (!theme) return

  // Primary background
  if (theme.backgroundColor) {
    container.style.backgroundColor = theme.backgroundColor
  }

  // Add subtle border for better definition
  if (theme.secondaryBackgroundColor) {
    container.style.border = `1px solid ${theme.secondaryBackgroundColor}`
    container.style.borderRadius = "4px"
  }

  // Ensure proper contrast for dark themes
  if (theme.base === "dark" && !theme.backgroundColor) {
    container.style.backgroundColor = "#1e1e1e"
  }
}

/**
 * Gets theme-aware button styles
 */
export function getButtonStyles(theme: Theme, isActive = false) {
  const isDark = theme.base === "dark"

  if (isActive) {
    return {
      backgroundColor: theme.primaryColor,
      borderColor: theme.primaryColor,
      color: "white",
    }
  }

  return isDark
    ? {
        backgroundColor: THEME.DARK.BUTTON_BG,
        borderColor: THEME.DARK.BUTTON_BORDER,
        color: theme.textColor,
      }
    : {
        backgroundColor: THEME.LIGHT.BUTTON_BG,
        borderColor: THEME.LIGHT.BUTTON_BORDER,
        color: theme.textColor,
      }
}

/**
 * Gets theme-aware panel styles
 */
export function getPanelStyles(theme: Theme) {
  const isDark = theme.base === "dark"

  return isDark
    ? {
        backgroundColor: THEME.DARK.BACKGROUND,
        border: THEME.DARK.BORDER,
        color: theme.textColor,
      }
    : {
        backgroundColor: THEME.LIGHT.BACKGROUND,
        border: THEME.LIGHT.BORDER,
        color: theme.textColor,
      }
}

/**
 * Creates fallback theme object
 */
export function createFallbackTheme(): Theme {
  return {
    base: "light",
    primaryColor: THEME.FALLBACK.PRIMARY_COLOR,
    backgroundColor: THEME.FALLBACK.BACKGROUND,
    secondaryBackgroundColor: THEME.FALLBACK.SECONDARY_BACKGROUND,
    textColor: THEME.FALLBACK.TEXT_COLOR,
    font: THEME.FALLBACK.FONT,
  } as Theme
}

