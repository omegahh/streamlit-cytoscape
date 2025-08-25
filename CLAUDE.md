# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Streamlit custom component that embeds interactive Cytoscape.js graphs with comprehensive accessibility, theme integration, bidirectional communication, and interactive control panels. The project consists of a Python backend (`streamlit_cytoscape/__init__.py`) that provides the Streamlit API and a React/TypeScript frontend that renders the actual graph visualization with advanced features including real-time layout switching and zoom controls.

## Development Commands

### Frontend Development (React 18 + TypeScript 5.7 + Vite 6)
```bash
cd streamlit_cytoscape/frontend
npm run dev        # Start Vite development server (hot reload)
npm start          # Alternative start command (port 3001)
npm run build      # Build production bundle with TypeScript + Vite
npm run preview    # Preview production build locally
npm test           # Run Vitest tests
npm run test:ui    # Run tests with interactive UI
```

### Python Package Development
```bash
pip install -e .           # Install in development mode
python -m build            # Build wheel and source distribution (uses pyproject.toml)
pip install build          # Install build tool if needed
```

### Development/Release Toggle
The component switches between development and production modes via `_RELEASE = True/False` in `streamlit_cytoscape/__init__.py:4`. 
- `_RELEASE = False`: Uses localhost:3001 for live frontend development with HMR
- `_RELEASE = True`: Uses built frontend from `frontend/build/` (current setting)

### Interactive Control Panel Features (v1.0.2+)
The component now includes an integrated control panel with:
- **Layout Switching**: Real-time switching between fcose, klay, cose, circle, and grid layouts
- **Zoom Controls**: In/Out zoom buttons and fit-to-view functionality  
- **Reset View**: One-click graph centering and layout refresh
- **Theme Integration**: Control panel adapts to Streamlit's dark/light theme automatically
- **Accessibility**: All controls are keyboard accessible and screen reader friendly

## Architecture Overview

### Two-Way Communication Pattern
The component implements Streamlit's bidirectional communication protocol:
1. **Python → React**: Parameters passed via `_component_func()` in `streamlit_cytoscape/__init__.py:76-89`
2. **React → Python**: Selected nodes/edges returned via `Streamlit.setComponentValue()` in `frontend/src/index.tsx:187`

### Modern Frontend Stack (2024)
- **React 18.3.1**: Latest stable React with modern patterns and concurrent features
- **TypeScript 5.7.2**: Strict type checking with advanced compiler options
- **Vite 6.0.7**: Lightning-fast build tool with HMR and optimized production builds
- **Vitest 2.1.8**: Modern testing framework (Jest-compatible, faster execution)
- **Cytoscape.js 3.33.1**: Latest graph visualization library with performance improvements

### Key Integration Points
- **Component Registration**: `streamlit_cytoscape/__init__.py:6-14` handles dev vs production component declaration
- **Interactive Control Panel**: `frontend/src/index.tsx:194-490` full-featured control panel with layout switching and zoom controls
- **Advanced Theme Integration**: `frontend/src/index.tsx:546-660` with automatic dark/light theme adaptation
- **Selection Management**: `frontend/src/index.tsx:510-541` with accessibility announcements and debounced updates
- **Keyboard Navigation**: `frontend/src/index.tsx:77-176` comprehensive keyboard accessibility
- **Scroll Protection**: `frontend/src/index.tsx:181-190` prevents canvas sizing issues
- **Memory Management**: `frontend/src/index.tsx:869-955` robust cleanup and lifecycle management

### Frontend Dependencies (Current)
- `cytoscape`: Core graph visualization library (v3.33.1) - latest stable
- `cytoscape-fcose`: Force-directed layout with constraints (v2.2.0) - latest
- `cytoscape-klay`: Hierarchical layout algorithm (v3.1.4) - latest
- `streamlit-component-lib`: Streamlit integration utilities (v2.0.0) - latest
- `react`: Modern React framework (v18.3.1) - latest stable
- `react-dom`: React DOM utilities (v18.3.1) - latest stable  
- `typescript`: TypeScript compiler (v5.7.2) - latest stable
- `vite`: Modern build tool (v6.0.7) - latest stable
- `vitest`: Modern testing framework (v2.1.8) - latest
- `@vitejs/plugin-react`: React plugin for Vite (v4.3.4) - latest
- `@testing-library/react`: React testing utilities (v16.1.0) - latest
- `jsdom`: DOM implementation for testing (v25.0.1) - latest

### Advanced Layout System
The component supports multiple sophisticated layout algorithms:
- **fcose**: Advanced force-directed with placement constraints and quality settings
- **klay**: Hierarchical layouts with edge routing and layer management
- **Standard Cytoscape.js layouts**: grid, circle, concentric, breadthfirst, cose, random, preset

## Implementation Architecture

### Enhanced Accessibility Features (v1.0.2)
- **ARIA Support**: Comprehensive ARIA labels and live regions (`frontend/src/index.tsx:21-51`)
- **Keyboard Navigation**: Full keyboard accessibility with arrow keys, Enter, Escape (`frontend/src/index.tsx:77-176`)
- **Screen Reader Integration**: Selection announcements and graph descriptions (`frontend/src/index.tsx:57-72`)
- **Focus Management**: Proper focus styling and tabindex handling (`frontend/src/index.tsx:790-799`)
- **Interactive Controls**: All control panel buttons support keyboard activation and screen reader announcements

### Advanced Theme Integration (Enhanced)
- **Dynamic Theme Adaptation**: Real-time theme switching with Streamlit theme changes (`frontend/src/index.tsx:546-660`)
- **Control Panel Theming**: Interactive controls automatically adapt to Streamlit themes (`frontend/src/index.tsx:213-346`)
- **Dark/Light Mode Support**: Automatic color scheme adaptation based on `theme.base` 
- **Enhanced Styling**: Primary color integration, hover effects, and selection highlighting
- **Typography Integration**: Streamlit font family and text color inheritance

### Selection Handling (Advanced)
The selection system uses optimized Cytoscape.js public API with performance enhancements:
- **Public API Usage**: `frontend/src/index.tsx:521-522` uses `.id()` method for element identification
- **Debounced Updates**: 100ms debouncing prevents excessive API calls (`frontend/src/index.tsx:756-765`)
- **Change Detection**: Only updates when selection actually changes (`frontend/src/index.tsx:526-534`)
- **Robust Error Handling**: Comprehensive error handling and fallback selection (`frontend/src/index.tsx:534-540`)
- **Selection Announcements**: Screen reader-friendly selection state announcements with detailed feedback

### Memory Management & Performance
- **Lifecycle Management**: Comprehensive cleanup functions preventing memory leaks (`frontend/src/index.tsx:869-955`)
- **ResizeObserver**: Responsive graph resizing with debounced calls (`frontend/src/index.tsx:804-818`)
- **Control Panel Cleanup**: Proper control panel and event listener cleanup (`frontend/src/index.tsx:900-904`)
- **Scroll Protection**: Prevents canvas size issues from wheel events (`frontend/src/index.tsx:181-190`)
- **Event Cleanup**: Proper event listener removal and Cytoscape instance destruction
- **Performance Monitoring**: Error boundaries and graceful degradation

### Package Structure (Updated)
- `streamlit_cytoscape/__init__.py`: Main Python API with enhanced parameter validation
- `streamlit_cytoscape/frontend/src/index.tsx`: Advanced React component with accessibility
- `streamlit_cytoscape/frontend/src/types/cytoscape.d.ts`: Comprehensive TypeScript definitions
- `streamlit_cytoscape/frontend/src/test/setup.ts`: Modern testing configuration  
- `streamlit_cytoscape/frontend/vite.config.ts`: Optimized Vite build with manual chunks
- `streamlit_cytoscape/frontend/vitest.config.ts`: Vitest configuration with jsdom
- `streamlit_cytoscape/frontend/tsconfig.json`: Strict TypeScript configuration
- `streamlit_cytoscape/frontend/tsconfig.node.json`: Node.js specific TypeScript config
- `pyproject.toml`: Modern Python packaging with build system integration
- `MANIFEST.in`: Frontend build artifacts inclusion for Python package distribution

## Modern Architecture Details (v1.0.1)

### TypeScript Configuration (Ultra-Strict)
The frontend uses an extremely strict TypeScript configuration (`frontend/tsconfig.json:20-33`):
- `strict: true` - All strict type-checking options enabled
- `exactOptionalPropertyTypes: true` - Strict optional property handling  
- `noUncheckedIndexedAccess: true` - Strict array/object access checking
- `noImplicitReturns: true` - Requires explicit returns in all code paths
- `noUnusedLocals/Parameters: true` - Prevents unused variable/parameter declarations

### Build System Optimization (Vite 6.0.7)
- **Manual Code Splitting**: Vendor libs and Cytoscape.js libs separated into dedicated chunks
- **Streamlit Compatibility**: Automated build process with proper asset path resolution
- **Source Maps**: Enabled for debugging in production builds
- **Tree Shaking**: Aggressive dead code elimination with modular architecture
- **HMR**: Hot Module Replacement for instant development feedback
- **Build Performance**: Sub-second builds with automated post-processing

### Testing Infrastructure (Modern)
- **Vitest 2.1.8**: Modern test runner with instant feedback
- **React Testing Library 16.1.0**: Component testing best practices
- **jsdom 25.0.1**: Browser environment simulation
- **@testing-library/jest-dom 6.6.3**: Enhanced DOM assertions
- **@vitest/ui**: Interactive test runner interface

### Component Lifecycle Management
- **Initialization**: `frontend/src/index.tsx:479-492` with comprehensive error handling
- **Cleanup**: `frontend/src/index.tsx:495-572` prevents memory leaks and dangling references  
- **Destruction**: `frontend/src/index.tsx:545-572` proper Cytoscape instance cleanup
- **Event Management**: Comprehensive event listener lifecycle management

## Current Status (v1.0.2)

### Package Health  
- **Version**: 1.0.2 (latest development release with enhanced controls)
- **Python Support**: 3.10, 3.11, 3.12 (modern Python versions only)
- **Streamlit Support**: 1.28.0+ (modern Streamlit custom components API)
- **Development Mode**: Currently set to production (`_RELEASE = True`)
- **Build Status**: Production-ready frontend artifacts included in package distribution
- **Dependency Health**: All dependencies at latest stable versions (verified 2024)

### Advanced Features (v1.0.2)
- **Interactive Control Panel**: Real-time layout switching, zoom controls, and view reset functionality
- **Accessibility**: WCAG 2.1 compliant with full keyboard navigation and screen reader support
- **Enhanced Performance**: Debounced updates, selection change detection, and scroll protection
- **Responsive Design**: ResizeObserver-based automatic layout adaptation
- **Theme Integration**: Deep Streamlit theme integration with primary colors, dark mode support for all UI elements
- **Error Boundaries**: Graceful error handling with fallback UI components
- **Type Safety**: Comprehensive TypeScript coverage with strict compiler settings

### Technical Improvements
- **Interactive Controls**: Complete control panel system with layout algorithms and zoom operations
- **Selection Logic**: Uses Cytoscape.js public API (`.id()`) with change detection and debouncing
- **Event System**: Modern event handling with proper cleanup and memory management
- **Scroll Protection**: Advanced wheel event handling to prevent canvas size issues
- **State Synchronization**: Robust bidirectional data flow with error recovery and performance optimization
- **Build Optimization**: Manual chunk splitting, tree shaking, and source map generation
- **Testing Coverage**: Modern testing setup with Vitest and React Testing Library

### Extension Integration
- **cytoscape-fcose v2.2.0**: Advanced force-directed layouts with constraint support
- **cytoscape-klay v3.1.4**: Hierarchical and directed graph layouts with edge routing
- **TypeScript Definitions**: Custom type definitions for extension libraries (`frontend/src/types/cytoscape.d.ts:1-115`)

## Troubleshooting

### Component Loading Issues
**Problem**: "Your app is having trouble loading the streamlit_cytoscape.streamlit_cytoscape component"

**Solution**: Ensure the frontend build is properly configured:
```bash
cd streamlit_cytoscape/frontend
npm run build
# Verify build/index.html and build/assets/ exist
```

**Root Cause**: The optimized modular architecture requires proper asset path resolution during build.

### Development vs Production Mode
- **Development** (`_RELEASE = False`): Uses localhost:3001 with modular hot reloading
- **Production** (`_RELEASE = True`): Uses pre-built assets from `frontend/build/`

### Build System Architecture
- **Modular Frontend**: 8 separate utility modules for better maintainability
- **Automated Build**: Post-processing ensures Streamlit compatibility
- **Asset Resolution**: Relative paths prevent deployment issues

## Known Considerations
- Extension libraries (fcose, klay) use custom TypeScript definitions due to lack of official types
- Component maintains compatibility with Streamlit's component lifecycle and theme system
- Modular architecture requires proper build process for asset bundling
- Build system optimized for both development speed and production performance