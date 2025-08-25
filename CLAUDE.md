# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**streamlit-cytoscape** is a Streamlit component that embeds interactive Cytoscape.js network graphs. It features a Python API that renders React/TypeScript frontend components with full graph visualization, layout controls, accessibility features, and export capabilities.

## Common Development Commands

### Python Package Development
- **Install development package:** `pip install -e .`
- **Build package:** `python -m build`
- **Run test component:** `streamlit run test_component.py`
- **Run enhanced features test:** `streamlit run test_enhanced_features.py`

### Frontend Development (in `streamlit_cytoscape/frontend/`)
- **Development server:** `npm run dev` or `npm run start` (runs on port 3001)
- **Build frontend:** `npm run build` (TypeScript compilation + Vite build)
- **Run tests:** `npm run test` (vitest)
- **Run tests with UI:** `npm run test:ui`
- **Install dependencies:** `npm install`

### Development Workflow
1. For frontend changes: Run `npm run start` in frontend directory for hot reload development
2. Set `_RELEASE = False` in `__init__.py` to use development server at localhost:3001
3. Build frontend with `npm run build` and set `_RELEASE = True` for production testing
4. Test with `streamlit run test_component.py` or `test_enhanced_features.py`

## Code Architecture

### Python Component (`streamlit_cytoscape/__init__.py`)
- **Main function:** `cytoscape()` - Creates interactive graph component
- **Development/Production modes:** Toggle via `_RELEASE` flag between local dev server and built assets
- **Component declaration:** Uses `streamlit.components.v1.declare_component()`
- **Selection handling:** Returns dict with "nodes" and "edges" keys containing selected element IDs

### Frontend Architecture (`streamlit_cytoscape/frontend/src/`)
- **Entry point:** `index.tsx` - Main component lifecycle and Cytoscape.js integration
- **Build system:** Vite with React plugin and custom Streamlit plugin
- **Extensions:** cytoscape-fcose and cytoscape-klay for advanced layouts

### Modular Utilities
- **`accessibility-utils.ts`** - Screen reader support, announcements, ARIA labels
- **`control-panel.ts`** - Interactive controls for layout switching, zoom, export
- **`keyboard-utils.ts`** - Full keyboard navigation support
- **`selection-utils.ts`** - Debounced selection handling and updates
- **`theme-utils.ts`** - Streamlit theme integration and styling
- **`resize-utils.ts`** - Responsive resizing with ResizeObserver
- **`scroll-utils.ts`** - Scroll behavior management

### Key Features
- **Layout algorithms:** fcose (force-directed), klay (hierarchical), cose, circle, grid
- **Enhanced controls:** Canvas padding, dynamic legend, export (PNG/SVG)
- **Accessibility:** Full keyboard navigation, screen reader support, announcements
- **Selection modes:** Single or additive selection with visual feedback
- **Zoom controls:** Mouse wheel (optional), control panel buttons, fit-to-view

## Component Parameters

### Required
- **`elements`** - List of Cytoscape.js nodes/edges with data, position, classes
- **`stylesheet`** - List of Cytoscape.js style objects for visual appearance

### Optional
- **`layout`** - Layout algorithm config (default: fcose with animationDuration: 0)
- **`selection_type`** - "single" or "additive" (default: "additive")
- **`wheel_zoom_enabled`** - Enable mouse wheel zoom (default: False)
- **`user_zooming_enabled`** - Allow zoom interactions (default: True)
- **`user_panning_enabled`** - Allow pan interactions (default: True)
- **`width`**, **`height`** - CSS dimensions (default: "100%", "300px")
- **`min_zoom`**, **`max_zoom`** - Zoom limits
- **`key`** - Streamlit component key for state persistence

## Testing Strategy

### Test Files
- **`test_component.py`** - Basic functionality, layout testing, selection verification
- **`test_enhanced_features.py`** - Advanced features, export functionality, accessibility

### Frontend Testing
- **Framework:** vitest with @testing-library/react
- **Setup:** jsdom environment, accessibility matchers
- **Test location:** `streamlit_cytoscape/frontend/src/test/`

## Development Notes

### Component State Management
- **Selection tracking:** Debounced updates prevent excessive re-renders
- **Accessibility announcements:** Screen reader notifications for selection changes
- **Keyboard navigation:** Arrow keys, Tab, Enter, Space for full interaction
- **Theme integration:** Automatic Streamlit theme detection and application

### Build Process
- **Frontend assets:** Built to `streamlit_cytoscape/frontend/build/`
- **Package inclusion:** MANIFEST.in includes all build artifacts
- **TypeScript:** Strict compilation with comprehensive type checking
- **Asset optimization:** Code splitting for vendor libraries and Cytoscape extensions

### Performance Considerations
- **Component lifecycle:** Proper cleanup of listeners, observers, and DOM elements
- **Debounced updates:** Selection changes batched to prevent excessive Streamlit updates
- **Memory management:** Component destruction removes all event listeners and references