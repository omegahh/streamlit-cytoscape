# st-cytoscape

[![PyPI version](https://badge.fury.io/py/st-cytoscape.svg)](https://badge.fury.io/py/st-cytoscape)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/streamlit-1.28.0+-red.svg)](https://streamlit.io/)

`st-cytoscape` is a modern [Streamlit](https://streamlit.io) component that embeds interactive [Cytoscape.js](https://js.cytoscape.org/) graphs with bidirectional communication for selected nodes and edges.

![Screenshot](screenshot.gif)

✨ **Version 1.0.1 Features:**

- 🚀 **Modern Stack**: Built with Cytoscape.js v3.33.1, React 18.3.1, TypeScript 5.7.2, and Vite 6.0.7
- ♿ **Accessibility**: WCAG 2.1 compliant with full keyboard navigation, ARIA support, and screen reader integration
- 🎨 **Advanced Theme Integration**: Real-time Streamlit theme adaptation with dark/light mode support
- ⚡ **Performance**: Optimized builds with manual code splitting, tree shaking, and ResizeObserver
- 🔧 **Developer Experience**: Ultra-strict TypeScript, Vitest testing, and comprehensive error handling
- 📱 **Responsive**: Mobile-friendly with automatic graph resizing and touch support
- 🎯 **Memory Management**: Robust lifecycle management preventing memory leaks
- 🔀 **Bidirectional Communication**: Enhanced selection synchronization with error recovery

A more advanced example can be seen live [here](https://share.streamlit.io/vivien0000/causal-simulator/main/app.py) ([code](https://github.com/vivien000/causal-simulator)).

## Installation

```bash
pip install st-cytoscape
```

**That's it!** No additional setup required. The package includes pre-built frontend assets.

### Requirements

- **Python**: 3.10 or higher
- **Streamlit**: 1.28.0 or higher

> **Note**: This package has been modernized for current Python and Streamlit versions. For legacy Python versions (3.6-3.9), please use st-cytoscape v0.0.4.

### Quick Verification

```bash
# Verify installation
python -c "from st_cytoscape import cytoscape; print('✅ st-cytoscape installed successfully!')"

# Run the quickstart example
streamlit run your_app.py
```

## Quickstart

```python
import streamlit as st
from st_cytoscape import cytoscape

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

# Accessibility info
st.caption("💡 **Accessibility**: Use arrow keys to navigate, Enter/Space to select, Escape to clear selection")
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
- `min_zoom` (float): cf. https://js.cytoscape.org/#core/initialisation
- `max_zoom` (float): cf. https://js.cytoscape.org/#core/initialisation
- `key` (str or None): an optional key that uniquely identifies this component. If this is None, and the component's arguments are changed, the component will be re-mounted in the Streamlit frontend and lose its current state

## Advanced Features

### 🚀 Advanced Layouts

#### fCoSE Layout (Force-directed)

`st-cytoscape` includes the powerful `fCoSE` layout engine ([cytoscape-fcose v2.2.0](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose)) for sophisticated force-directed positioning with constraint support.

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
cd st_cytoscape/frontend
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

## 🛠️ Contributing to st-cytoscape

> **For End Users**: Skip this section! You only need `pip install st-cytoscape`. 
> 
> **For Contributors**: This section explains how to modify and build the component.

### Development Environment Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/st-cytoscape.git
cd st-cytoscape

# 2. Install Python package in development mode
pip install -e .

# 3. Setup frontend development (for component modification)
cd st_cytoscape/frontend
npm install

# 4. Enable development mode
# Edit st_cytoscape/__init__.py and change:
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
cd st_cytoscape/frontend

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
# Edit st_cytoscape/__init__.py: _RELEASE = False → _RELEASE = True
```

### Building and Publishing (Maintainers Only)

```bash
# 1. Ensure frontend is built
cd st_cytoscape/frontend
npm run build

# 2. Ensure production mode
# In st_cytoscape/__init__.py: _RELEASE = True

# 3. Build Python package
cd ../..  # Back to project root
python -m build

# 4. Verify package contents include frontend/build/
tar -tzf dist/st-cytoscape-*.tar.gz | grep "frontend/build"

# 5. Test locally before publishing
pip install dist/st_cytoscape-*.whl
```

## 💡 Best Practices & Troubleshooting

### Performance Optimization

```python
# For large graphs (>1000 nodes)
layout = {
    \"name\": \"fcose\",
    \"animationDuration\": 0,    # Skip animation for faster render
    \"quality\": \"draft\",        # Faster layout calculation
    \"sampleSize\": 25           # Reduce sample size for speed
}

# Use stable keys to prevent re-mounting
selected = cytoscape(elements, stylesheet, key=\"stable_key_123\")

# Optimize element structure
elements = [
    {\"data\": {\"id\": \"node1\"}},  # Minimal data structure
    # Avoid deep nesting in data objects
]
```

### Memory Management

```python
# Always use stable keys for components that update frequently
import hashlib

def generate_stable_key(elements):
    \"\"\"Generate consistent key based on graph structure\"\"\"
    key_data = str(sorted([e[\"data\"][\"id\"] for e in elements]))
    return hashlib.md5(key_data.encode()).hexdigest()[:8]

selected = cytoscape(elements, stylesheet, key=generate_stable_key(elements))
```

### Theme Customization

```python
# Override theme styles while maintaining integration
custom_stylesheet = [
    {
        \"selector\": \"node\",
        \"style\": {
            \"background-color\": \"data(color)\",  # Data-driven colors
            \"label\": \"data(label)\",
            \"font-family\": \"inherit\",  # Inherits Streamlit theme font
            \"color\": \"inherit\"       # Inherits Streamlit text color
        }
    }
]

# Theme colors are automatically applied for:
# - Selected elements (primary color)
# - Hover states (primary color with transparency)  
# - Background (Streamlit background color)
# - Text (Streamlit text color)
```

### Common Issues & Solutions

**Issue**: Graph not updating when data changes
```python
# Solution: Use stable, unique keys
selected = cytoscape(elements, stylesheet, key=f\"graph_{data_version}\")
```

**Issue**: Slow performance with large graphs
```python
# Solution: Optimize layout and disable animations
layout = {\"name\": \"fcose\", \"animationDuration\": 0, \"quality\": \"draft\"}
```

**Issue**: Selection not working as expected
```python
# Solution: Check element structure and selection_type
elements = [{\"data\": {\"id\": \"unique_id\"}}]  # Ensure unique IDs
selected = cytoscape(elements, stylesheet, selection_type=\"additive\")  # or \"single\"
```

**Issue**: Accessibility concerns
```python
# Solution: Component is automatically accessible
# Ensure your Streamlit app has proper heading structure:
st.title(\"Network Analysis\")
st.subheader(\"Interactive Graph\") 
selected = cytoscape(elements, stylesheet, key=\"main_graph\")
```

## 🚀 Advanced Usage Examples

### Dynamic Graph with Real-time Updates

```python
import streamlit as st
from st_cytoscape import cytoscape
import time

# Simulate dynamic data
if \"graph_data\" not in st.session_state:
    st.session_state.graph_data = {\"nodes\": 3, \"edges\": 2}

# Dynamic element generation
def create_dynamic_elements(num_nodes, num_edges):
    elements = []
    
    # Create nodes
    for i in range(num_nodes):
        elements.append({
            \"data\": {
                \"id\": f\"node_{i}\",
                \"label\": f\"Node {i}\",
                \"value\": i * 10  # Data-driven sizing
            }
        })
    
    # Create edges
    for i in range(min(num_edges, num_nodes - 1)):
        elements.append({
            \"data\": {
                \"id\": f\"edge_{i}\",
                \"source\": f\"node_{i}\",
                \"target\": f\"node_{i+1}\"
            }
        })
    
    return elements

# Dynamic styling based on data
stylesheet = [
    {
        \"selector\": \"node\",
        \"style\": {
            \"label\": \"data(label)\",
            \"width\": \"mapData(value, 0, 100, 20, 60)\",
            \"height\": \"mapData(value, 0, 100, 20, 60)\",
            \"background-color\": \"#0074D9\",
            \"color\": \"white\",
            \"text-valign\": \"center\",
            \"text-halign\": \"center\",
            \"font-family\": \"inherit\"
        }
    }
]

# Controls
col1, col2 = st.columns(2)
with col1:
    nodes = st.slider(\"Number of nodes\", 2, 10, st.session_state.graph_data[\"nodes\"])
with col2:
    edges = st.slider(\"Number of edges\", 1, nodes-1, min(st.session_state.graph_data[\"edges\"], nodes-1))

st.session_state.graph_data = {\"nodes\": nodes, \"edges\": edges}

# Generate stable key for consistent rendering
graph_key = f\"dynamic_graph_{nodes}_{edges}\"
elements = create_dynamic_elements(nodes, edges)

# Render with advanced layout
selected = cytoscape(
    elements,
    stylesheet,
    layout={\"name\": \"fcose\", \"animationDuration\": 600, \"fit\": True},
    height=\"500px\",
    key=graph_key
)

# Enhanced selection feedback
if selected[\"nodes\"] or selected[\"edges\"]:
    st.success(f\"🎯 Selected: {len(selected['nodes'])} nodes, {len(selected['edges'])} edges\")
```

### Multi-Layout Comparison

```python
import streamlit as st
from st_cytoscape import cytoscape

# Sample network data
elements = [
    {\"data\": {\"id\": \"A\", \"label\": \"Node A\"}},
    {\"data\": {\"id\": \"B\", \"label\": \"Node B\"}},
    {\"data\": {\"id\": \"C\", \"label\": \"Node C\"}},
    {\"data\": {\"id\": \"D\", \"label\": \"Node D\"}},
    {\"data\": {\"source\": \"A\", \"target\": \"B\", \"id\": \"AB\"}},
    {\"data\": {\"source\": \"B\", \"target\": \"C\", \"id\": \"BC\"}},
    {\"data\": {\"source\": \"C\", \"target\": \"D\", \"id\": \"CD\"}},
    {\"data\": {\"source\": \"D\", \"target\": \"A\", \"id\": \"DA\"}},
]

# Layout options
layouts = {
    \"Force-directed (fCoSE)\": {\"name\": \"fcose\", \"animationDuration\": 800},
    \"Hierarchical (Klay)\": {\"name\": \"klay\", \"direction\": \"DOWN\"},
    \"Grid\": {\"name\": \"grid\", \"rows\": 2},
    \"Circle\": {\"name\": \"circle\"},
    \"Breadthfirst\": {\"name\": \"breadthfirst\", \"directed\": True}\n}\n\nlayout_choice = st.selectbox(\"Choose Layout Algorithm\", list(layouts.keys()))\n\n# Render with selected layout\nselected = cytoscape(\n    elements, \n    stylesheet=[{\"selector\": \"node\", \"style\": {\"label\": \"data(label)\"}}],\n    layout=layouts[layout_choice],\n    height=\"400px\",\n    key=f\"layout_demo_{layout_choice.replace(' ', '_')}\"\n)\n\nst.info(f\"💡 **{layout_choice}** layout selected. Try different layouts to see how they affect node positioning!\")\n```\n\n### Interactive Network Analysis\n\n```python\nimport streamlit as st\nfrom st_cytoscape import cytoscape\nimport pandas as pd\n\n# Sample network analysis data\nnetwork_data = {\n    \"nodes\": [\n        {\"id\": \"user1\", \"type\": \"user\", \"influence\": 85},\n        {\"id\": \"user2\", \"type\": \"user\", \"influence\": 62},\n        {\"id\": \"user3\", \"type\": \"admin\", \"influence\": 95},\n        {\"id\": \"content1\", \"type\": \"content\", \"engagement\": 120},\n        {\"id\": \"content2\", \"type\": \"content\", \"engagement\": 89},\n    ],\n    \"edges\": [\n        {\"source\": \"user1\", \"target\": \"content1\", \"interaction\": \"like\", \"weight\": 3},\n        {\"source\": \"user2\", \"target\": \"content1\", \"interaction\": \"share\", \"weight\": 5},\n        {\"source\": \"user3\", \"target\": \"content2\", \"interaction\": \"comment\", \"weight\": 4},\n    ]\n}\n\n# Convert to Cytoscape format\nelements = []\nfor node in network_data[\"nodes\"]:\n    elements.append({\"data\": node})\nfor edge in network_data[\"edges\"]:\n    elements.append({\"data\": {\"source\": edge[\"source\"], \"target\": edge[\"target\"], **edge}})\n\n# Advanced styling with data-driven visuals\nstylesheet = [\n    {\n        \"selector\": \"node[type='user']\",\n        \"style\": {\n            \"background-color\": \"#3498db\",\n            \"label\": \"data(id)\",\n            \"width\": \"mapData(influence, 0, 100, 30, 60)\",\n            \"height\": \"mapData(influence, 0, 100, 30, 60)\",\n            \"shape\": \"ellipse\"\n        }\n    },\n    {\n        \"selector\": \"node[type='admin']\",\n        \"style\": {\n            \"background-color\": \"#e74c3c\",\n            \"label\": \"data(id)\",\n            \"width\": \"mapData(influence, 0, 100, 30, 60)\",\n            \"height\": \"mapData(influence, 0, 100, 30, 60)\",\n            \"shape\": \"diamond\"\n        }\n    },\n    {\n        \"selector\": \"node[type='content']\",\n        \"style\": {\n            \"background-color\": \"#2ecc71\",\n            \"label\": \"data(id)\",\n            \"width\": \"mapData(engagement, 0, 150, 25, 50)\",\n            \"height\": \"mapData(engagement, 0, 150, 25, 50)\",\n            \"shape\": \"rectangle\"\n        }\n    },\n    {\n        \"selector\": \"edge\",\n        \"style\": {\n            \"width\": \"mapData(weight, 1, 5, 2, 8)\",\n            \"line-color\": \"#95a5a6\",\n            \"target-arrow-color\": \"#95a5a6\",\n            \"target-arrow-shape\": \"triangle\",\n            \"curve-style\": \"bezier\",\n            \"label\": \"data(interaction)\",\n            \"font-size\": \"10px\",\n            \"text-rotation\": \"autorotate\"\n        }\n    }\n]\n\n# Interactive analysis\nst.title(\"\ud83d\udd0d Network Analysis Dashboard\")\nst.markdown(\"**Instructions**: Click nodes to analyze connections. Use keyboard navigation for accessibility.\")\n\nselected = cytoscape(\n    elements,\n    stylesheet,\n    layout={\"name\": \"fcose\", \"animationDuration\": 1000, \"nodeRepulsion\": 8000},\n    height=\"600px\",\n    selection_type=\"additive\",\n    key=\"network_analysis\"\n)\n\n# Analysis results\nif selected[\"nodes\"]:\n    selected_data = [node for node in network_data[\"nodes\"] if node[\"id\"] in selected[\"nodes\"]]\n    df = pd.DataFrame(selected_data)\n    \n    st.subheader(\"\ud83c\udfa1 Selected Node Analysis\")\n    st.dataframe(df, use_container_width=True)\n    \n    # Calculate metrics\n    if \"influence\" in df.columns:\n        avg_influence = df[\"influence\"].mean()\n        st.metric(\"Average Influence\", f\"{avg_influence:.1f}\")\n    \n    if \"engagement\" in df.columns:\n        avg_engagement = df[\"engagement\"].mean()\n        st.metric(\"Average Engagement\", f\"{avg_engagement:.1f}\")\n\nif selected[\"edges\"]:\n    selected_edges = [edge for edge in network_data[\"edges\"] \n                     if f\"{edge['source']}{edge['target']}\" in selected[\"edges\"] or \n                        f\"{edge['source']}\u279e{edge['target']}\" in selected[\"edges\"]]\n    \n    if selected_edges:\n        st.subheader(\"\ud83d\udd17 Selected Connection Analysis\")\n        edge_df = pd.DataFrame(selected_edges)\n        st.dataframe(edge_df, use_container_width=True)\n```

## Version History

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
