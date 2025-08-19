# st-cytoscape

[![PyPI version](https://badge.fury.io/py/st-cytoscape.svg)](https://badge.fury.io/py/st-cytoscape)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/streamlit-1.28.0+-red.svg)](https://streamlit.io/)

`st-cytoscape` is a modern [Streamlit](https://streamlit.io) component that embeds interactive [Cytoscape.js](https://js.cytoscape.org/) graphs with bidirectional communication for selected nodes and edges.

![Screenshot](screenshot.gif)

✨ **Version 1.0.0 Features:**
- 🚀 **Modern Stack**: Built with Cytoscape.js v3.33.1, React 18, TypeScript 5.7, and Vite
- 🎨 **Theme Integration**: Automatic Streamlit theme adaptation
- ⚡ **Performance**: Optimized builds with code splitting and tree shaking
- 🔧 **Developer Experience**: Full TypeScript support and modern tooling
- 📱 **Responsive**: Mobile-friendly and accessible

A more advanced example can be seen live [here](https://share.streamlit.io/vivien0000/causal-simulator/main/app.py) ([code](https://github.com/vivien000/causal-simulator)).

## Installation

```bash
pip install st-cytoscape
```

### Requirements

- **Python**: 3.10 or higher
- **Streamlit**: 1.28.0 or higher

> **Note**: This package has been modernized for current Python and Streamlit versions. For legacy Python versions (3.6-3.9), please use st-cytoscape v0.0.4.

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

# Define visual styling
stylesheet = [
    {
        "selector": "node",
        "style": {
            "label": "data(id)",
            "width": 20,
            "height": 20,
            "background-color": "#0074D9",
            "color": "white"
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

# Render the graph and capture selection
selected = cytoscape(elements, stylesheet, key="graph")

# Display selected elements
if selected["nodes"]:
    st.success(f"Selected nodes: {', '.join(selected['nodes'])}")
if selected["edges"]:
    st.info(f"Selected edges: {', '.join(selected['edges'])}")
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

## Advanced Layouts

### fCoSE Layout (Force-directed)

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

### Klay Layout (Hierarchical)

For hierarchical and directed graphs, use the `klay` layout ([cytoscape-klay v3.1.4](https://github.com/cytoscape/cytoscape.js-klay)):

```python
# Basic hierarchical layout
layout = {"name": "klay"}

# Advanced klay with options
layout = {
    "name": "klay",
    "direction": "DOWN",  # DOWN, UP, LEFT, RIGHT
    "spacing": 20,
    "klay": {
        "spacing": 20,
        "direction": "DOWN"
    }
}
```

### Native Cytoscape.js Layouts

All standard [Cytoscape.js layouts](https://js.cytoscape.org/#layouts) are supported:

```python
# Grid layout
layout = {"name": "grid", "rows": 2}

# Circle layout  
layout = {"name": "circle"}

# Breadthfirst layout
layout = {"name": "breadthfirst", "directed": True}
```

## Theme Integration

The component automatically adapts to your Streamlit theme:

```python
# The component will automatically use:
# - st.get_option("theme.primaryColor") for selections
# - st.get_option("theme.backgroundColor") for background
# - st.get_option("theme.textColor") for labels
# - st.get_option("theme.font") for typography
```

## Performance Tips

- **Use stable keys**: Provide a consistent `key` parameter to prevent unnecessary re-renders
- **Optimize large graphs**: For >1000 nodes, consider pagination or filtering
- **Layout caching**: Set `animationDuration: 0` for faster initial renders

## Version History

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
