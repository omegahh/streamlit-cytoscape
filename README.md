# streamlit-cytoscape

[![PyPI version](https://badge.fury.io/py/streamlit-cytoscape.svg)](https://badge.fury.io/py/streamlit-cytoscape)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/streamlit-1.28.0+-red.svg)](https://streamlit.io/)

`streamlit-cytoscape` is a modern [Streamlit](https://streamlit.io) component that embeds interactive [Cytoscape.js](https://js.cytoscape.org/) graphs with bidirectional communication for selected nodes and edges.

> **Note**: This package was formerly known as `st-cytoscape`. Special thanks to the original `st-cytoscape` contributors for their foundational work!

✨ **Version 1.0.3 Features:**

- 🚀 **Modern Stack**: Built with Cytoscape.js v3.33.1, React 18.3.1, TypeScript 5.7.2, and Vite 6.0.7
- 🎮 **Enhanced Control Panel**: Real-time layout switching, zoom controls, view reset, PNG/SVG export, and dynamic legend
- 🖱️ **Mouse Interaction Control**: Configurable mouse wheel zoom (disabled by default for better UX)
- 📤 **Export Functionality**: High-quality PNG and vector SVG export with one-click download
- 🏷️ **Dynamic Legend**: Automatic legend generation based on node labels and visual styles
- ♿ **Accessibility**: WCAG 2.1 compliant with full keyboard navigation, ARIA support, and screen reader integration
- 🎨 **Advanced Theme Integration**: Real-time Streamlit theme adaptation with dark/light mode support for all UI elements
- 🖼️ **Optimized Canvas**: Professional spacing with proper padding and visual hierarchy
- ⚡ **Performance**: Optimized builds with manual code splitting, tree shaking, and ResizeObserver
- 🔧 **Developer Experience**: Ultra-strict TypeScript, Vitest testing, and comprehensive error handling
- 📱 **Responsive**: Mobile-friendly with automatic graph resizing and touch support
- 🎯 **Memory Management**: Robust lifecycle management preventing memory leaks
- 🔀 **Bidirectional Communication**: Enhanced selection synchronization with error recovery

## Installation

```bash
pip install streamlit-cytoscape
```

**That's it!** No additional setup required. The package includes pre-built frontend assets.

### Requirements

- **Python**: 3.10 or higher
- **Streamlit**: 1.28.0 or higher

### Quick Verification

```bash
# Verify installation
python -c "from streamlit_cytoscape import cytoscape; print('✅ streamlit-cytoscape installed successfully!')"

# Run the quickstart example
streamlit run your_app.py
```

## Quickstart

```python
import streamlit as st
from streamlit_cytoscape import cytoscape

# Define graph elements
elements = [
    {"data": {"id": "X"}, "selected": True, "selectable": False},
    {"data": {"id": "Y"}},
    {"data": {"id": "Z"}},
    {"data": {"source": "X", "target": "Y", "id": "X➞Y"}},
    {"data": {"source": "Z", "target": "Y", "id": "Z➞Y"}},
    {"data": {"source": "Z", "target": "X", "id": "Z➞X"}},
]

# Define visual styling (theme colors automatically applied)
stylesheet = [
    {
        "selector": "node",
        "style": {
            "label": "data(id)",
            "width": 20,
            "height": 20,
            "background-color": "#0074D9",
            "color": "white",
            "font-family": "inherit",  # Uses Streamlit theme font
            "font-size": "12px"
        }
    },
    {
        "selector": "edge",
        "style": {
            "width": 3,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "line-color": "#85144b",
            "target-arrow-color": "#85144b"
        },
    },
]

# Advanced layout configuration
layout = {
    "name": "fcose",
    "animationDuration": 800,
    "fit": True,
    "padding": 30
}

# Render the graph with accessibility and theme support
selected = cytoscape(
    elements,
    stylesheet,
    layout=layout,
    height="400px",
    key="graph"  # Stable key prevents unnecessary re-renders
)

# Display selected elements with enhanced feedback
if selected["nodes"]:
    st.success(f"✅ Selected {len(selected['nodes'])} node(s): {', '.join(selected['nodes'])}")
if selected["edges"]:
    st.info(f"🔗 Selected {len(selected['edges'])} edge(s): {', '.join(selected['edges'])}")

# Interactive controls and accessibility info
st.caption("🎮 **Enhanced Control Panel**: Layout switching • Zoom controls • PNG/SVG export • Dynamic legend")
st.caption("🖱️ **Mouse Controls**: Drag to pan • Control panel zoom (wheel zoom disabled by default)")
st.caption("💡 **Accessibility**: Arrow keys to navigate • Enter/Space to select • Escape to clear selection")
```

## Usage

**cytoscape (elements,
stylesheet,
width="100%",
height="300px",
layout={"name": "fcose", "animationDuration": 0},
selection_type="additive",
user_zooming_enabled=True,
user_panning_enabled=True,
wheel_zoom_enabled=False,
min_zoom=1e-50,
max_zoom=1e50,
key=None
)**

Embeds a Cytoscape.js graph and returns a dictionary containing the list of the ids of selected nodes ("nodes" key) and the list of the ids of the selected edges ("edges" key)

### Parameters

- `elements` (list): the list of nodes and edges of the graph
  (cf. https://js.cytoscape.org/#notation/elements-json)
- `stylesheet` (list): the style used for the graph (cf. https://js.cytoscape.org/#style)
- `width` (string): the CSS width attribute of the graph's container
- `height` (string): the CSS height attribute of the graph's container
- `layout` (dict): the layout options for the graph (cf. https://js.cytoscape.org/#layouts)
- `selection_type` (string: "single" or "additive"): selection behavior for nodes and edges
- `user_zooming_enabled` (boolean): cf. https://js.cytoscape.org/#core/initialisation
- `user_panning_enabled` (boolean): cf. https://js.cytoscape.org/#core/initialisation
- `wheel_zoom_enabled` (boolean): **NEW!** Enable mouse wheel zooming (default: False for better UX)
- `min_zoom` (float): cf. https://js.cytoscape.org/#core/initialisation
- `max_zoom` (float): cf. https://js.cytoscape.org/#core/initialisation
- `key` (str or None): an optional key that uniquely identifies this component. If this is None, and the component's arguments are changed, the component will be re-mounted in the Streamlit frontend and lose its current state

## Advanced Features

### 🚀 Advanced Layouts

#### fCoSE Layout (Force-directed)

`streamlit-cytoscape` includes the powerful `fCoSE` layout engine ([cytoscape-fcose v2.2.0](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose)) for sophisticated force-directed positioning with constraint support.

```python
# Basic fCoSE layout
layout = {"name": "fcose", "animationDuration": 500}

# Advanced fCoSE with constraints
layout = {
    "name": "fcose",
    "animationDuration": 1000,
    "fit": True,
    "padding": 30,
    "quality": "proof",  # "draft", "default", "proof"
    "randomize": False,
    "nodeRepulsion": 4500,
    "idealEdgeLength": 50,
    # Alignment constraints
    "alignmentConstraint": {"horizontal": [["X", "Y"]]},
    # Relative positioning
    "relativePlacementConstraint": [
        {"top": "Z", "bottom": "X"},
        {"left": "X", "right": "Y"}
    ]
}

selected = cytoscape(elements, stylesheet, layout=layout)
```

#### Klay Layout (Hierarchical)

For hierarchical and directed graphs, use the `klay` layout ([cytoscape-klay v3.1.4](https://github.com/cytoscape/cytoscape.js-klay)):

```python
# Basic hierarchical layout
layout = {"name": "klay"}

# Advanced klay with comprehensive options
layout = {
    "name": "klay",
    "direction": "DOWN",  # DOWN, UP, LEFT, RIGHT
    "spacing": 20,
    "nodeLayering": "NETWORK_SIMPLEX",  # LONGEST_PATH, INTERACTIVE
    "edgeRouting": "ORTHOGONAL",  # POLYLINE, SPLINES
    "crossingMinimization": "LAYER_SWEEP",
    "thoroughness": 7,
    "klay": {
        "spacing": 20,
        "direction": "DOWN",
        "fixedAlignment": "BALANCED"
    }
}
```

#### Native Cytoscape.js Layouts

All standard [Cytoscape.js layouts](https://js.cytoscape.org/#layouts) are supported:

```python
# Grid layout
layout = {"name": "grid", "rows": 2, "cols": 3}

# Circle layout
layout = {"name": "circle", "radius": 100}

# Breadthfirst layout
layout = {"name": "breadthfirst", "directed": True, "spacingFactor": 1.5}

# Concentric layout
layout = {"name": "concentric", "minNodeSpacing": 20}
```

### 📤 Export Functionality

**NEW in v1.0.3!** Export your graphs as high-quality images with one-click download:

```python
# Export functionality is automatically available in the control panel
# Users can click "PNG" or "SVG" buttons to download their graphs

# No additional configuration needed!
selected = cytoscape(
    elements,
    stylesheet,
    layout={"name": "fcose", "animationDuration": 500},
    height="500px",
    key="exportable_graph"
)

# Control panel includes:
# - PNG Export: High-resolution (2x scale) raster images
# - SVG Export: Vector graphics that scale perfectly
# - Files automatically download to user's default folder
```

**Export Features:**
- **PNG Export**: 2x resolution for crisp, high-quality images
- **SVG Export**: Vector format maintains quality at any scale  
- **One-Click Download**: Files save automatically to browser's download folder
- **Clean Output**: White background with proper margins
- **Full Graph**: Exports complete graph, not just visible area
- **Accessibility**: Screen reader announcements for export success/failure

### 🏷️ Dynamic Legend System

**NEW in v1.0.3!** Automatic legend generation based on your node types and styles:

```python
# Create nodes with different types/classes
elements = [
    # Server nodes
    {"data": {"id": "DB1", "label": "Database Server"}, "classes": ["server"]},
    {"data": {"id": "WEB1", "label": "Web Server"}, "classes": ["server"]},
    
    # Client nodes  
    {"data": {"id": "APP1", "label": "Mobile App"}, "classes": ["client"]},
    {"data": {"id": "BROWSER1", "label": "Web Browser"}, "classes": ["client"]},
    
    # Service nodes
    {"data": {"id": "API1", "label": "API Gateway"}, "classes": ["service"]},
]

# Style different node types
stylesheet = [
    # Server nodes - Blue rectangles
    {
        "selector": ".server",
        "style": {
            "background-color": "#3498db",
            "shape": "roundrectangle",
            "label": "data(label)",
        },
    },
    # Client nodes - Green circles
    {
        "selector": ".client", 
        "style": {
            "background-color": "#2ecc71",
            "shape": "ellipse",
            "label": "data(label)",
        },
    },
    # Service nodes - Orange diamonds
    {
        "selector": ".service",
        "style": {
            "background-color": "#f39c12",
            "shape": "diamond", 
            "label": "data(label)",
        },
    },
]

# Legend automatically appears in control panel!
selected = cytoscape(elements, stylesheet, key="legend_demo")

# Legend shows:
# 🔵 Database Server
# 🔵 Web Server  
# 🟢 Mobile App
# 🟢 Web Browser
# 🟠 API Gateway
```

**Legend Features:**
- **Automatic Detection**: Extracts unique node labels from graph data
- **Style Matching**: Shows actual colors and shapes from your stylesheet
- **Smart Grouping**: Groups nodes by visual appearance
- **Scrollable Design**: Handles many node types (max height: 120px)
- **Theme Integration**: Adapts to Streamlit's light/dark themes
- **Visual Indicators**: Colored shapes matching your node styles

### 🖱️ Mouse Interaction Control

**NEW in v1.0.3!** Fine-grained control over mouse interactions:

```python
# Default: Wheel zoom disabled for better UX (recommended)
selected = cytoscape(
    elements, 
    stylesheet,
    wheel_zoom_enabled=False,  # Default - drag to pan, control panel for zoom
    key="controlled_interaction"
)

# Enable wheel zoom if needed for your use case
selected = cytoscape(
    elements,
    stylesheet, 
    wheel_zoom_enabled=True,   # Traditional mouse wheel zoom
    key="wheel_zoom_enabled"
)

# Best practice: Use default (False) for cleaner UX
# Users can:
# - Drag to pan the graph
# - Use control panel buttons for zoom (➕ ➖ ⊡)
# - Reset view with control panel
# - Export graphs with control panel
```

**Interaction Modes:**

**wheel_zoom_enabled=False (Recommended Default):**
- ✅ Drag to pan: Smooth graph navigation
- ✅ Control panel zoom: Precise zoom controls (➕ ➖ ⊡)
- ✅ Better UX: No accidental zooming while scrolling page
- ✅ All other features work: Export, legend, layout switching

**wheel_zoom_enabled=True (Traditional):**
- ✅ Mouse wheel zoom: Traditional zoom with scroll wheel
- ✅ Drag to pan: Standard graph navigation
- ✅ Control panel zoom: Still available
- ⚠️ Can interfere with page scrolling in some layouts

### ♿ Accessibility Features

Comprehensive WCAG 2.1 compliance with enterprise-level accessibility:

```python
# Accessibility is automatic - no configuration needed!
# Features include:
# - Full keyboard navigation (arrow keys, Enter, Escape, Home, End)
# - Screen reader announcements for selections
# - ARIA labels describing graph structure
# - Focus management and visual focus indicators
# - Semantic HTML structure with proper roles

selected = cytoscape(elements, stylesheet, key="accessible_graph")

# Component automatically announces:
# "Selected 2 nodes: X, Y" (to screen readers)
# "Interactive network graph with 3 nodes and 3 edges. Use arrow keys to navigate..."
```

**Keyboard Navigation:**

- `Arrow Keys`: Navigate between elements
- `Enter/Space`: Select/toggle element selection
- `Escape`: Clear all selections
- `Home`: Select first element
- `End`: Select last element
- `Tab`: Focus graph container

### 🎨 Advanced Theme Integration

Deep integration with Streamlit's theming system:

```python
# Automatic theme adaptation (no code required)
# The component automatically detects and applies:
# - Primary colors for selections and hover states
# - Background colors with dark/light mode support
# - Text colors and font families from your theme
# - Border colors and visual hierarchy

# Theme integration works seamlessly:
selected = cytoscape(elements, stylesheet, key="themed_graph")

# Advanced theme customization through Streamlit config
# Set in .streamlit/config.toml:
# [theme]
# primaryColor = "#FF6B6B"
# backgroundColor = "#FFFFFF"
# secondaryBackgroundColor = "#F0F2F6"
# textColor = "#262730"
```

### ⚡ Performance & Optimization

Built for high-performance graph visualization:

```python
# Optimized for large graphs
layout = {
    "name": "fcose",
    "animationDuration": 0,  # Faster initial render
    "fit": True,
    "quality": "draft"  # Faster layout for large graphs
}

# Performance-optimized rendering
selected = cytoscape(
    elements,
    stylesheet,
    layout=layout,
    key="perf_graph",  # Stable key prevents re-mounting
    user_zooming_enabled=True,
    user_panning_enabled=True,
    min_zoom=0.1,  # Allow zooming out for large graphs
    max_zoom=10.0
)

# Component automatically includes:
# - ResizeObserver for responsive behavior
# - Debounced update calls
# - Memory leak prevention
# - Efficient DOM manipulation
```

### 🧪 Testing Infrastructure

Modern testing setup with comprehensive coverage:

```bash
# Run tests
cd streamlit_cytoscape/frontend
npm test              # Run all tests
npm run test:ui       # Interactive test UI
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

**Testing Stack:**

- **Vitest 2.1.8**: Lightning-fast test runner (Jest-compatible)
- **React Testing Library 16.1.0**: Component testing best practices
- **jsdom 25.0.1**: Browser environment simulation
- **@testing-library/jest-dom 6.6.3**: Enhanced DOM assertions

## 🛠️ Contributing to streamlit-cytoscape

> **For End Users**: Skip this section! You only need `pip install streamlit-cytoscape`.
>
> **For Contributors**: This section explains how to modify and build the component.

### Development Environment Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/streamlit-cytoscape.git
cd streamlit-cytoscape

# 2. Install Python package in development mode
pip install -e .

# 3. Setup frontend development (for component modification)
cd streamlit_cytoscape/frontend
npm install

# 4. Enable development mode
# Edit streamlit_cytoscape/__init__.py and change:
# _RELEASE = True  →  _RELEASE = False

# 5. Start frontend development server
npm run dev  # Serves on localhost:3001 with hot reload

# 6. In another terminal, test with Streamlit
cd ../..  # Back to project root
streamlit run examples/your_test_app.py
```

### Why Development Mode?

The package works in two modes:

- **Production Mode** (`_RELEASE = True`): Uses pre-built assets from `frontend/build/`
- **Development Mode** (`_RELEASE = False`): Uses live development server for frontend changes

### Frontend Development Cycle (Contributors Only)

```bash
# Make sure you're in frontend directory
cd streamlit_cytoscape/frontend

# Development with hot reload (after npm install)
npm run dev

# Type checking and building
npm run build  # TypeScript compilation + Vite build

# Testing
npm test           # Run tests
npm run test:ui    # Interactive test interface
npm test -- --coverage  # Coverage report

# When done: Build for production and restore release mode
npm run build      # Creates frontend/build/
# Edit streamlit_cytoscape/__init__.py: _RELEASE = False → _RELEASE = True
```

### Building and Publishing (Maintainers Only)

```bash
# 1. Ensure frontend is built
cd streamlit_cytoscape/frontend
npm run build

# 2. Ensure production mode
# In streamlit_cytoscape/__init__.py: _RELEASE = True

# 3. Build Python package
cd ../..  # Back to project root
python -m build

# 4. Verify package contents include frontend/build/
tar -tzf dist/streamlit_cytoscape-*.tar.gz | grep "frontend/build"

# 5. Test locally before publishing
pip install dist/streamlit_cytoscape-*.whl
```

## 💡 Best Practices & Troubleshooting

### Performance Optimization

```python
# For large graphs (>1000 nodes)
layout = {
    "name": "fcose",
    "animationDuration": 0,    # Skip animation for faster render
    "quality": "draft",        # Faster layout calculation
    "sampleSize": 25           # Reduce sample size for speed
}

# Use stable keys to prevent re-mounting
selected = cytoscape(elements, stylesheet, key="stable_key_123")

# Optimize element structure
elements = [
    {"data": {"id": "node1"}},  # Minimal data structure
    # Avoid deep nesting in data objects
]
```

### Memory Management

```python
# Always use stable keys for components that update frequently
import hashlib

def generate_stable_key(elements):
    """Generate consistent key based on graph structure"""
    key_data = str(sorted([e["data"]["id"] for e in elements]))
    return hashlib.md5(key_data.encode()).hexdigest()[:8]

selected = cytoscape(elements, stylesheet, key=generate_stable_key(elements))
```

### Theme Customization

```python
# Override theme styles while maintaining integration
custom_stylesheet = [
    {
        "selector": "node",
        "style": {
            "background-color": "data(color)",  # Data-driven colors
            "label": "data(label)",
            "font-family": "inherit",  # Inherits Streamlit theme font
            "color": "inherit"       # Inherits Streamlit text color
        }
    }
]

# Theme colors are automatically applied for:
# - Selected elements (primary color)
# - Hover states (primary color with transparency)
# - Background (Streamlit background color)
# - Text (Streamlit text color)
```

### New Features Best Practices (v1.0.3)

```python
# Export Functionality - Professional graphs
selected = cytoscape(
    elements,
    clean_stylesheet,  # Use clean colors and fonts for better export quality
    layout={"name": "fcose", "fit": True, "padding": 30},  # Add padding for exports
    height="600px",    # Larger height for better export resolution
    key="export_ready_graph"
)
# Users can click PNG/SVG buttons in control panel to export

# Dynamic Legend - Best practices
elements = [
    # Use descriptive labels that will appear in legend
    {"data": {"id": "srv1", "label": "Database Server"}, "classes": ["server"]},
    {"data": {"id": "api1", "label": "API Service"}, "classes": ["service"]},
    # Legend automatically shows: "Database Server", "API Service"
]

stylesheet = [
    # Use distinct colors for different node types  
    {"selector": ".server", "style": {"background-color": "#3498db"}},   # Blue
    {"selector": ".service", "style": {"background-color": "#f39c12"}},  # Orange
    # Legend shows colored indicators matching these styles
]

# Mouse Interaction - Recommended settings
selected = cytoscape(
    elements, 
    stylesheet,
    wheel_zoom_enabled=False,  # Default: Better UX, no accidental zoom
    user_panning_enabled=True,  # Keep drag-to-pan
    layout={"name": "fcose", "animationDuration": 500},
    key="optimized_interaction"
)

# Canvas Optimization - The component now includes proper padding automatically
# No additional configuration needed for professional spacing!
```

### Common Issues & Solutions

**Issue**: Component loading error: "Your app is having trouble loading the streamlit_cytoscape.streamlit_cytoscape component"

```bash
# Solution: Ensure proper build structure (for developers/contributors)
cd streamlit_cytoscape/frontend
npm run build
# This creates the required build/index.html and build/assets/ structure
```

**Issue**: Graph not updating when data changes

```python
# Solution: Use stable, unique keys
selected = cytoscape(elements, stylesheet, key=f"graph_{data_version}")
```

**Issue**: Slow performance with large graphs

```python
# Solution: Optimize layout and disable animations
layout = {"name": "fcose", "animationDuration": 0, "quality": "draft"}
```

**Issue**: Selection not working as expected

```python
# Solution: Check element structure and selection_type
elements = [{"data": {"id": "unique_id"}}]  # Ensure unique IDs
selected = cytoscape(elements, stylesheet, selection_type="additive")  # or "single"
```

**Issue**: Enhanced control panel not visible or responding

```python
# Solution: The component automatically includes enhanced controls in the top-right
# Ensure you're not overriding the key parameter too frequently:
selected = cytoscape(elements, stylesheet, key="stable_graph_key")
# Enhanced control panel (v1.0.3) includes:
# - Layout switching (Force, Hierarchical, CoSE, Circle, Grid, Reset View)
# - Zoom controls (+ - ⊡) 
# - Export buttons (PNG, SVG)
# - Dynamic legend (automatic based on node labels)
```

**Issue**: Accessibility concerns

```python
# Solution: Component is automatically accessible
# Ensure your Streamlit app has proper heading structure:
st.title("Network Analysis")
st.subheader("Interactive Graph")
selected = cytoscape(elements, stylesheet, key="main_graph")
```

## 🚀 Advanced Usage Examples

### Dynamic Graph with Real-time Updates

```python
import streamlit as st
from streamlit_cytoscape import cytoscape
import time

# Simulate dynamic data
if "graph_data" not in st.session_state:
    st.session_state.graph_data = {"nodes": 3, "edges": 2}

# Dynamic element generation
def create_dynamic_elements(num_nodes, num_edges):
    elements = []

    # Create nodes
    for i in range(num_nodes):
        elements.append({
            "data": {
                "id": f"node_{i}",
                "label": f"Node {i}",
                "value": i * 10  # Data-driven sizing
            }
        })

    # Create edges
    for i in range(min(num_edges, num_nodes - 1)):
        elements.append({
            "data": {
                "id": f"edge_{i}",
                "source": f"node_{i}",
                "target": f"node_{i+1}"
            }
        })

    return elements

# Dynamic styling based on data
stylesheet = [
    {
        "selector": "node",
        "style": {
            "label": "data(label)",
            "width": "mapData(value, 0, 100, 20, 60)",
            "height": "mapData(value, 0, 100, 20, 60)",
            "background-color": "#0074D9",
            "color": "white",
            "text-valign": "center",
            "text-halign": "center",
            "font-family": "inherit"
        }
    }
]

# Controls
col1, col2 = st.columns(2)
with col1:
    nodes = st.slider("Number of nodes", 2, 10, st.session_state.graph_data["nodes"])
with col2:
    edges = st.slider("Number of edges", 1, nodes-1, min(st.session_state.graph_data["edges"], nodes-1))

st.session_state.graph_data = {"nodes": nodes, "edges": edges}

# Generate stable key for consistent rendering
graph_key = f"dynamic_graph_{nodes}_{edges}"
elements = create_dynamic_elements(nodes, edges)

# Render with advanced layout
selected = cytoscape(
    elements,
    stylesheet,
    layout={"name": "fcose", "animationDuration": 600, "fit": True},
    height="500px",
    key=graph_key
)

# Enhanced selection feedback
if selected["nodes"] or selected["edges"]:
    st.success(f"🎯 Selected: {len(selected['nodes'])} nodes, {len(selected['edges'])} edges")
```

### Multi-Layout Comparison

```python
import streamlit as st
from streamlit_cytoscape import cytoscape

# Sample network data
elements = [
    {"data": {"id": "A", "label": "Node A"}},
    {"data": {"id": "B", "label": "Node B"}},
    {"data": {"id": "C", "label": "Node C"}},
    {"data": {"id": "D", "label": "Node D"}},
    {"data": {"source": "A", "target": "B", "id": "AB"}},
    {"data": {"source": "B", "target": "C", "id": "BC"}},
    {"data": {"source": "C", "target": "D", "id": "CD"}},
    {"data": {"source": "D", "target": "A", "id": "DA"}},
]

# Layout options
layouts = {
    "Force-directed (fCoSE)": {"name": "fcose", "animationDuration": 800},
    "Hierarchical (Klay)": {"name": "klay", "direction": "DOWN"},
    "Grid": {"name": "grid", "rows": 2},
    "Circle": {"name": "circle"},
    "Breadthfirst": {"name": "breadthfirst", "directed": True},
}

layout_choice = st.selectbox("Choose Layout Algorithm", list(layouts.keys()))

# Render with selected layout
selected = cytoscape(
    elements,
    stylesheet=[{"selector": "node", "style": {"label": "data(label)"}}],
    layout=layouts[layout_choice],
    height="400px",
    key=f"layout_demo_{layout_choice.replace(' ', '_')}",
)

st.info(
    f"💡 **{layout_choice}** layout selected. Try different layouts to see how they affect node positioning!"
)
```

### Interactive Network Analysis

```python
import pandas as pd
import streamlit as st

from streamlit_cytoscape import cytoscape

# Sample network analysis data
network_data = {
    "nodes": [
        {"id": "user1", "type": "user", "influence": 85},
        {"id": "user2", "type": "user", "influence": 62},
        {"id": "user3", "type": "admin", "influence": 95},
        {"id": "content1", "type": "content", "engagement": 120},
        {"id": "content2", "type": "content", "engagement": 89},
    ],
    "edges": [
        {"source": "user1", "target": "content1", "interaction": "like", "weight": 3},
        {"source": "user2", "target": "content1", "interaction": "share", "weight": 5},
        {
            "source": "user3",
            "target": "content2",
            "interaction": "comment",
            "weight": 4,
        },
    ],
}

# Convert to Cytoscape format
elements = []
for node in network_data["nodes"]:
    elements.append({"data": node})
for edge in network_data["edges"]:
    elements.append(
        {"data": {"source": edge["source"], "target": edge["target"], **edge}}
    )

# Advanced styling with data-driven visuals
stylesheet = [
    {
        "selector": "node[type='user']",
        "style": {
            "background-color": "#3498db",
            "label": "data(id)",
            "width": "mapData(influence, 0, 100, 30, 60)",
            "height": "mapData(influence, 0, 100, 30, 60)",
            "shape": "ellipse",
        },
    },
    {
        "selector": "node[type='admin']",
        "style": {
            "background-color": "#e74c3c",
            "label": "data(id)",
            "width": "mapData(influence, 0, 100, 30, 60)",
            "height": "mapData(influence, 0, 100, 30, 60)",
            "shape": "diamond",
        },
    },
    {
        "selector": "node[type='content']",
        "style": {
            "background-color": "#2ecc71",
            "label": "data(id)",
            "width": "mapData(engagement, 0, 150, 25, 50)",
            "height": "mapData(engagement, 0, 150, 25, 50)",
            "shape": "rectangle",
        },
    },
    {
        "selector": "edge",
        "style": {
            "width": "mapData(weight, 1, 5, 2, 8)",
            "line-color": "#95a5a6",
            "target-arrow-color": "#95a5a6",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "label": "data(interaction)",
            "font-size": "10px",
            "text-rotation": "autorotate",
        },
    },
]

# Interactive analysis with enhanced features
st.title("😀 Network Analysis Dashboard")
st.markdown("""
**Instructions**: 
- Click nodes to analyze connections
- Use enhanced control panel for layouts, zoom, and export
- Legend shows node types automatically
- Drag to pan (wheel zoom disabled for better UX)
""")

selected = cytoscape(
    elements,
    stylesheet,
    layout={"name": "fcose", "animationDuration": 1000, "nodeRepulsion": 8000},
    height="600px",
    selection_type="additive",
    wheel_zoom_enabled=False,  # Better UX - drag to pan, control panel zoom
    key="network_analysis",
)

# Analysis results
if selected["nodes"]:
    selected_data = [
        node for node in network_data["nodes"] if node["id"] in selected["nodes"]
    ]
    df = pd.DataFrame(selected_data)

    st.subheader("Selected Node Analysis")
    st.dataframe(df, use_container_width=True)

    # Calculate metrics
    if "influence" in df.columns:
        avg_influence = df["influence"].mean()
        st.metric("Average Influence", f"{avg_influence:.1f}")

    if "engagement" in df.columns:
        avg_engagement = df["engagement"].mean()
        st.metric("Average Engagement", f"{avg_engagement:.1f}")

if selected["edges"]:
    selected_edges = [
        edge
        for edge in network_data["edges"]
        if f"{edge['source']}{edge['target']}" in selected["edges"]
        or f"{edge['source']}→{edge['target']}" in selected["edges"]
    ]

    if selected_edges:
        st.subheader("Selected Connection Analysis")
        edge_df = pd.DataFrame(selected_edges)
        st.dataframe(edge_df, use_container_width=True)
```

## Version History

### v1.0.3 (2024) - Current

- 📤 **Export Functionality**: High-quality PNG (2x resolution) and vector SVG export with one-click download
- 🏷️ **Dynamic Legend System**: Automatic legend generation based on node labels and visual styles
- 🖱️ **Mouse Interaction Control**: Configurable wheel zoom (disabled by default for better UX)
- 🎮 **Enhanced Control Panel**: Reorganized layout with export buttons and scrollable legend
- 🖼️ **Optimized Canvas**: Professional spacing with 16px padding and improved visual hierarchy
- ♿ **Improved Accessibility**: Export announcements and enhanced screen reader support
- 🎨 **Better Theming**: Legend and export buttons adapt to Streamlit themes
- ⚡ **Performance**: Optimized control panel rendering and memory management

### v1.0.2 (2024)

- 🎮 **Interactive Control Panel**: Real-time layout switching, zoom controls, and view reset functionality
- ♿ **Enhanced Accessibility**: WCAG 2.1 compliance with full keyboard navigation and screen reader support
- 🎨 **Advanced Theme Integration**: Real-time dark/light mode adaptation with enhanced styling for all UI elements
- ⚡ **Performance**: ResizeObserver, debounced updates, and comprehensive memory management
- 🔧 **Developer Experience**: Ultra-strict TypeScript 5.7.2 with advanced compiler options
- 🧪 **Testing**: Modern Vitest 2.1.8 setup with React Testing Library 16.1.0
- 🚀 **Build System**: Vite 6.0.7 with manual code splitting and tree shaking
- 🎯 **Type Safety**: Comprehensive TypeScript definitions for all extensions
- 📱 **Responsive**: Automatic graph resizing with ResizeObserver API

### v1.0.1 (2024)

- ♿ **Accessibility**: WCAG 2.1 compliance with full keyboard navigation and screen reader support
- 🎨 **Advanced Theme Integration**: Real-time dark/light mode adaptation with enhanced styling
- ⚡ **Performance**: ResizeObserver, debounced updates, and comprehensive memory management
- 🔧 **Developer Experience**: Ultra-strict TypeScript 5.7.2 with advanced compiler options
- 🧪 **Testing**: Modern Vitest 2.1.8 setup with React Testing Library 16.1.0
- 🚀 **Build System**: Vite 6.0.7 with manual code splitting and tree shaking
- 🎯 **Type Safety**: Comprehensive TypeScript definitions for all extensions
- 📱 **Responsive**: Automatic graph resizing with ResizeObserver API

### v1.0.0 (2024)

- 🚀 Complete modernization with Cytoscape.js v3.33.1
- ⚡ Vite build system for faster development
- 🎯 TypeScript 5.7 with strict type checking
- 🎨 Enhanced Streamlit theme integration
- 📱 Improved mobile responsiveness
- 🔧 Modern React 18 patterns

### v0.0.4 (Legacy)

- Legacy version for Python 3.6-3.9 compatibility
- Cytoscape.js v3.20.0
- Create React App build system
