# 🕸️ Streamlit Cytoscape

[![PyPI version](https://badge.fury.io/py/streamlit-cytoscape.svg)](https://badge.fury.io/py/streamlit-cytoscape)
[![Python](https://img.shields.io/pypi/pyversions/streamlit-cytoscape.svg)](https://pypi.org/project/streamlit-cytoscape/)
[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/your-app-url)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful and interactive **Streamlit component** for displaying **Cytoscape.js** network graphs with advanced features including dynamic layouts, export functionality, full accessibility support, and seamless Streamlit theme integration.

## ✨ Features

### 🎮 **Interactive Graph Visualization**
- **Multiple Layout Algorithms**: Force-directed (fcose), Hierarchical (klay), CoSE, Circle, Grid
- **Real-time Layout Switching**: Change layouts dynamically with visual feedback
- **Advanced Selection**: Single or additive selection modes with visual indicators
- **Zoom & Pan Controls**: Mouse interactions, control panel buttons, and fit-to-view

### 🎨 **Enhanced User Experience** 
- **Control Panel**: Interactive buttons for layout switching, zoom controls, and view reset
- **Export Functionality**: High-resolution PNG and vector SVG export capabilities
- **Dynamic Legend**: Automatically generated legends based on node types and styling
- **Canvas Padding**: Optimized spacing and visual presentation
- **Theme Integration**: Seamless integration with Streamlit's light/dark themes

### ♿ **Accessibility & Usability**
- **Full Keyboard Navigation**: Arrow keys, Tab, Enter, and Space key support
- **Screen Reader Support**: ARIA labels, announcements, and semantic markup
- **Responsive Design**: Automatic resizing and mobile-friendly interactions
- **Visual Feedback**: Clear indicators for active controls and selections

### 🔧 **Developer-Friendly**
- **Simple Python API**: Easy-to-use function with comprehensive parameters
- **TypeScript Frontend**: Robust, type-safe frontend implementation
- **Comprehensive Testing**: Both Python and JavaScript test suites
- **Development Mode**: Hot-reload development server for rapid iteration

## 📦 Installation

```bash
pip install streamlit-cytoscape
```

## 🚀 Quick Start

Create your first interactive network graph in just a few lines:

```python
import streamlit as st
from streamlit_cytoscape import cytoscape

# Define your graph data
elements = [
    {"data": {"id": "A", "label": "Node A"}},
    {"data": {"id": "B", "label": "Node B"}},
    {"data": {"id": "C", "label": "Node C"}},
    {"data": {"source": "A", "target": "B", "id": "AB"}},
    {"data": {"source": "B", "target": "C", "id": "BC"}},
]

# Define styling
stylesheet = [
    {
        "selector": "node",
        "style": {
            "content": "data(label)",
            "width": 60,
            "height": 60,
            "background-color": "#0074D9",
            "color": "white",
            "text-valign": "center",
            "text-halign": "center",
        }
    },
    {
        "selector": "edge",
        "style": {
            "width": 3,
            "line-color": "#85144b",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#85144b",
        }
    }
]

# Create the graph
selected = cytoscape(elements, stylesheet, height="400px")

# Handle selection
if selected["nodes"]:
    st.write(f"Selected nodes: {selected['nodes']}")
if selected["edges"]:
    st.write(f"Selected edges: {selected['edges']}")
```

## 🔍 Advanced Usage

### Complex Network with Multiple Node Types

```python
import streamlit as st
from streamlit_cytoscape import cytoscape

# Define network with different node categories
elements = [
    # Server nodes
    {"data": {"id": "server1", "label": "Database"}, "classes": ["server"]},
    {"data": {"id": "server2", "label": "API Server"}, "classes": ["server"]},
    
    # Client nodes
    {"data": {"id": "client1", "label": "Web App"}, "classes": ["client"]},
    {"data": {"id": "client2", "label": "Mobile App"}, "classes": ["client"]},
    
    # Connections
    {"data": {"source": "client1", "target": "server1", "id": "c1-s1"}},
    {"data": {"source": "client2", "target": "server2", "id": "c2-s2"}},
    {"data": {"source": "server1", "target": "server2", "id": "s1-s2"}},
]

# Advanced styling with classes
stylesheet = [
    # Base node styles
    {
        "selector": "node",
        "style": {
            "content": "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "color": "white",
            "font-size": "12px",
            "width": 80,
            "height": 60,
        }
    },
    # Server-specific styling
    {
        "selector": ".server",
        "style": {
            "background-color": "#3498db",
            "shape": "roundrectangle",
        }
    },
    # Client-specific styling
    {
        "selector": ".client", 
        "style": {
            "background-color": "#2ecc71",
            "shape": "ellipse",
        }
    },
    # Edge styling
    {
        "selector": "edge",
        "style": {
            "width": 3,
            "line-color": "#95a5a6",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#95a5a6",
            "curve-style": "bezier",
        }
    }
]

# Create graph with advanced options
selected = cytoscape(
    elements=elements,
    stylesheet=stylesheet,
    width="100%",
    height="500px",
    layout={"name": "fcose", "animationDuration": 800},
    selection_type="additive",  # Allow multiple selections
    wheel_zoom_enabled=True,    # Enable mouse wheel zoom
    key="advanced_network"      # Unique key for state persistence
)
```

### Layout Configuration Examples

```python
# Force-directed layout (default)
layout_fcose = {
    "name": "fcose",
    "animationDuration": 1000,
    "fit": True,
    "padding": 30
}

# Hierarchical layout
layout_klay = {
    "name": "klay",
    "direction": "DOWN",
    "spacing": 50
}

# Circular layout
layout_circle = {
    "name": "circle",
    "radius": 200,
    "startAngle": -90
}

# Grid layout
layout_grid = {
    "name": "grid",
    "rows": 2,
    "cols": 3
}

# Use any layout
cytoscape(elements, stylesheet, layout=layout_fcose)
```

## 📖 API Reference

### `cytoscape(elements, stylesheet, **kwargs)`

#### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `elements` | `List[Dict]` | List of nodes and edges following [Cytoscape.js format](https://js.cytoscape.org/#notation/elements-json) |
| `stylesheet` | `List[Dict]` | Visual styles following [Cytoscape.js styling](https://js.cytoscape.org/#style) |

#### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `str` | `"100%"` | CSS width of the component |
| `height` | `str` | `"300px"` | CSS height of the component |
| `layout` | `Dict` | `{"name": "fcose", "animationDuration": 0}` | Layout algorithm configuration |
| `selection_type` | `str` | `"additive"` | Selection mode: `"single"` or `"additive"` |
| `user_zooming_enabled` | `bool` | `True` | Enable zoom interactions |
| `user_panning_enabled` | `bool` | `True` | Enable pan interactions |
| `wheel_zoom_enabled` | `bool` | `False` | Enable mouse wheel zooming |
| `min_zoom` | `float` | `1e-50` | Minimum zoom level |
| `max_zoom` | `float` | `1e50` | Maximum zoom level |
| `key` | `str` | `None` | Unique identifier for component state |

#### Returns

`Dict[str, List[str]]`: Dictionary with `"nodes"` and `"edges"` keys containing lists of selected element IDs.

## 🎨 Styling Guide

### Node Styling Options

```python
node_style = {
    "selector": "node",
    "style": {
        # Shape and size
        "width": 60,
        "height": 60,
        "shape": "ellipse",  # ellipse, triangle, rectangle, roundrectangle, diamond
        
        # Colors and borders
        "background-color": "#0074D9",
        "border-width": 2,
        "border-color": "#ffffff",
        
        # Labels
        "content": "data(label)",
        "color": "#ffffff",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
        "text-wrap": "wrap",
        "text-max-width": "80px",
    }
}
```

### Edge Styling Options

```python
edge_style = {
    "selector": "edge", 
    "style": {
        # Line appearance
        "width": 3,
        "line-color": "#85144b",
        "curve-style": "bezier",  # straight, bezier, unbundled-bezier
        
        # Arrows
        "target-arrow-shape": "triangle",
        "target-arrow-color": "#85144b",
        "source-arrow-shape": "circle",
        "source-arrow-color": "#85144b",
        
        # Labels
        "content": "data(label)",
        "font-size": "10px",
        "text-rotation": "autorotate",
    }
}
```

### Class-Based Styling

```python
# Define classes in elements
elements = [
    {"data": {"id": "important", "label": "Important Node"}, "classes": ["highlighted"]},
    {"data": {"id": "normal", "label": "Normal Node"}},
]

# Style classes specifically
stylesheet = [
    {
        "selector": ".highlighted",
        "style": {
            "background-color": "#ff4136",
            "border-width": 3,
            "border-color": "#ffdc00",
        }
    }
]
```

## 🎮 Interactive Features

### Control Panel

The component includes a built-in control panel with:

- **Layout Buttons**: Switch between fcose, klay, cose, circle, and grid layouts
- **Zoom Controls**: Zoom in (`+`), zoom out (`-`), fit to view (`⊡`)
- **Reset View**: Refresh current layout
- **Export Options**: Download PNG or SVG files
- **Dynamic Legend**: Shows node types with colors and shapes

### Export Functionality

```python
# The control panel automatically provides:
# - PNG Export: High-resolution (2x scale) raster image
# - SVG Export: Vector graphics for scalability
# Files download to browser's default download location
```

### Keyboard Navigation

- **Arrow Keys**: Navigate between nodes
- **Tab**: Move focus through interactive elements  
- **Enter/Space**: Select focused elements
- **Escape**: Clear selections

## ♿ Accessibility Features

This component is built with accessibility in mind:

### Screen Reader Support
- **ARIA Labels**: All interactive elements properly labeled
- **Live Regions**: Selection changes announced to screen readers
- **Semantic Markup**: Proper heading structure and landmarks

### Keyboard Navigation
- **Full Keyboard Access**: All functionality available via keyboard
- **Focus Management**: Clear visual focus indicators
- **Logical Tab Order**: Intuitive navigation sequence

### Visual Accessibility
- **Theme Integration**: Respects Streamlit's light/dark mode preferences
- **High Contrast**: Clear visual distinctions for all elements
- **Responsive Text**: Scalable fonts and interface elements

## 🛠️ Development

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Development Setup

1. **Clone and install Python package:**
```bash
git clone https://github.com/omegahh/streamlit-cytoscape.git
cd streamlit-cytoscape
pip install -e .
```

2. **Install frontend dependencies:**
```bash
cd streamlit_cytoscape/frontend
npm install
```

3. **Start development server:**
```bash
npm run start  # Frontend dev server on port 3001
```

4. **Enable development mode in Python:**
```python
# In streamlit_cytoscape/__init__.py
_RELEASE = False  # Use development server
```

5. **Test the component:**
```bash
streamlit run test_component.py
```

### Build Process

1. **Build frontend:**
```bash
cd streamlit_cytoscape/frontend
npm run build
```

2. **Enable production mode:**
```python
# In streamlit_cytoscape/__init__.py
_RELEASE = True  # Use built assets
```

3. **Test production build:**
```bash
streamlit run test_component.py
```

### Running Tests

**Frontend tests:**
```bash
cd streamlit_cytoscape/frontend
npm test        # Run vitest
npm run test:ui # Run with UI
```

**Python tests:**
```bash
python -m pytest  # If pytest is configured
```

### Project Structure

```
streamlit-cytoscape/
├── streamlit_cytoscape/
│   ├── __init__.py              # Main Python API
│   └── frontend/
│       ├── src/
│       │   ├── index.tsx        # Main component
│       │   ├── control-panel.ts # Interactive controls
│       │   ├── accessibility-utils.ts
│       │   ├── theme-utils.ts
│       │   └── types/           # TypeScript definitions
│       ├── package.json         # Frontend dependencies
│       └── vite.config.ts       # Build configuration
├── test_component.py            # Basic functionality tests
├── test_enhanced_features.py    # Advanced features tests
├── pyproject.toml              # Python package configuration
└── CLAUDE.md                   # Development documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Run tests**: Ensure both frontend and Python tests pass
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Standards

- **Code Style**: Follow existing TypeScript and Python conventions
- **Testing**: Add tests for new features
- **Documentation**: Update README and inline documentation
- **Accessibility**: Maintain WCAG 2.1 compliance
- **Performance**: Consider impact on large graphs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Cytoscape.js](https://cytoscape.org/)**: The powerful graph visualization library
- **[Streamlit](https://streamlit.io/)**: The amazing Python web app framework  
- **[React](https://reactjs.org/)**: Frontend component framework
- **[Vite](https://vitejs.dev/)**: Lightning-fast build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/omegahh/streamlit-cytoscape/issues)
- **Discussions**: [GitHub Discussions](https://github.com/omegahh/streamlit-cytoscape/discussions)  
- **Documentation**: [API Reference](#api-reference)

---

**Made with ❤️ for the Streamlit community**