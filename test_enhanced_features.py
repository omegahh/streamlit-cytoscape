#!/usr/bin/env python3
"""
Test script for enhanced streamlit-cytoscape features
"""

import streamlit as st
from streamlit_cytoscape import cytoscape

# Configure page
st.set_page_config(page_title="Enhanced Cytoscape Test", layout="wide")
st.title("🚀 Enhanced Streamlit Cytoscape Test")

# Create sample data with different node types for legend demonstration
elements = [
    # Server nodes
    {"data": {"id": "Server1", "label": "Database Server"}, "position": {"x": 100, "y": 100}, "classes": ["server"]},
    {"data": {"id": "Server2", "label": "Web Server"}, "position": {"x": 200, "y": 100}, "classes": ["server"]},
    
    # Client nodes  
    {"data": {"id": "Client1", "label": "Mobile App"}, "position": {"x": 100, "y": 200}, "classes": ["client"]},
    {"data": {"id": "Client2", "label": "Web Browser"}, "position": {"x": 200, "y": 200}, "classes": ["client"]},
    
    # Service nodes
    {"data": {"id": "Service1", "label": "API Gateway"}, "position": {"x": 300, "y": 150}, "classes": ["service"]},
    {"data": {"id": "Service2", "label": "Authentication"}, "position": {"x": 400, "y": 150}, "classes": ["service"]},
    
    # Connections
    {"data": {"source": "Client1", "target": "Service1", "id": "C1-S1"}},
    {"data": {"source": "Client2", "target": "Service1", "id": "C2-S1"}},
    {"data": {"source": "Service1", "target": "Server1", "id": "S1-Srv1"}},
    {"data": {"source": "Service1", "target": "Server2", "id": "S1-Srv2"}},
    {"data": {"source": "Service1", "target": "Service2", "id": "S1-S2"}},
]

stylesheet = [
    # Default node style
    {
        "selector": "node",
        "style": {
            "content": "data(label)",
            "width": 80,
            "height": 60,
            "color": "white",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "10px",
            "text-wrap": "wrap",
            "text-max-width": "70px",
            "border-width": 2,
            "border-color": "white",
        },
    },
    # Server nodes - Blue
    {
        "selector": ".server",
        "style": {
            "background-color": "#3498db",
            "shape": "roundrectangle",
        },
    },
    # Client nodes - Green  
    {
        "selector": ".client",
        "style": {
            "background-color": "#2ecc71",
            "shape": "ellipse",
        },
    },
    # Service nodes - Orange
    {
        "selector": ".service",
        "style": {
            "background-color": "#f39c12",
            "shape": "diamond",
        },
    },
    # Edge styling
    {
        "selector": "edge",
        "style": {
            "width": 3,
            "line-color": "#95a5a6",
            "target-arrow-color": "#95a5a6",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
        },
    },
]

# Test configurations
st.header("🎛️ Test Configuration")

col1, col2, col3 = st.columns(3)

with col1:
    wheel_zoom = st.checkbox(
        "Enable Mouse Wheel Zoom", 
        value=False, 
        help="Enable or disable mouse wheel zooming. When disabled, only control panel zoom works. Drag to pan is always available."
    )

with col2:
    initial_layout = st.selectbox(
        "Initial Layout", 
        options=["fcose", "klay", "cose", "circle", "grid"], 
        index=0,
        help="Choose the initial layout algorithm"
    )

with col3:
    graph_height = st.selectbox(
        "Graph Height", 
        options=["400px", "500px", "600px"], 
        index=1
    )

# Display the enhanced cytoscape component
st.header("📊 Enhanced Graph Visualization")

st.info(f"""
**Current Configuration:**
- 🖱️ Mouse wheel zoom: {'✅ Enabled' if wheel_zoom else '❌ Disabled (drag to pan, use control panel to zoom)'}
- 📐 Initial layout: {initial_layout.upper()}
- 📏 Height: {graph_height}
- 🎮 Interactive controls: Layout switching, zoom controls, reset view, export (PNG/SVG), dynamic legend
- 🎨 Canvas: Optimized with proper padding and spacing
- 🔧 wheel_zoom_enabled parameter: `{wheel_zoom}`
""")

# Create the cytoscape component with enhanced features
selected = cytoscape(
    elements=elements,
    stylesheet=stylesheet,
    width="100%",
    height=graph_height,
    layout={"name": initial_layout, "animationDuration": 500},
    wheel_zoom_enabled=wheel_zoom,  # New parameter!
    key=f"enhanced_graph_{wheel_zoom}_{initial_layout}_{graph_height}"
)

# Display selection results
if selected:
    st.header("🎯 Selection Results")
    if selected["nodes"]:
        st.success(f"Selected nodes: {', '.join(selected['nodes'])}")
    if selected["edges"]:
        st.success(f"Selected edges: {', '.join(selected['edges'])}")

# Instructions
st.header("📋 Testing Instructions")

st.markdown("""
### Test the Enhanced Features:

1. **🎯 Layout Selection:**
   - Use the control panel to switch between different layouts (Force, Hierarchical, CoSE, Circle, Grid)
   - Notice the visual feedback for the active layout button
   - Try the "Reset View" button to refresh the layout

2. **🔍 Zoom Controls:**
   - Use the ➕ and ➖ buttons to zoom in/out
   - Use the ⊡ button to fit the graph to view
   - Try mouse wheel: should only work when enabled above

3. **🖱️ Mouse Interactions:**
   - **Drag to pan:** Should always work regardless of wheel zoom setting
   - **Mouse wheel:** Should only zoom when checkbox above is enabled
   - **Node selection:** Click nodes to select them

4. **📤 Export Functionality:**
   - **PNG Export:** Click "PNG" button to download high-resolution PNG image
   - **SVG Export:** Click "SVG" button to download vector SVG file
   - **File Download:** Files automatically download to your default download folder
   - **Quality:** PNG exports at 2x scale for high resolution, SVG maintains vector quality

5. **🏷️ Dynamic Legend:**
   - **Node Types**: Automatically displays different node categories based on labels
   - **Visual Indicators**: Shows color and shape for each node type
   - **Smart Extraction**: Legend updates based on your graph data
   - **Scrollable**: Handles many node types with scrollable legend area

6. **♿ Accessibility:**
   - All controls have tooltips and proper ARIA labels
   - Layout changes and exports are announced to screen readers
   - Keyboard navigation is supported

### Expected Behavior:
- **Wheel zoom disabled (default):** Drag to pan, no wheel zoom, control panel zoom works
- **Wheel zoom enabled:** All interactions work including mouse wheel zoom  
- **Control panel:** Always functional with enhanced visual feedback
- **Export functionality:** PNG/SVG download should work in all configurations
- **File downloads:** Should save to your browser's default download location
- **Dynamic legend:** Shows Server (🔵 blue rectangles), Client (🟢 green ovals), Service (🟠 orange diamonds)
- **Legend updates:** Automatically reflects any changes to node types and colors
""")