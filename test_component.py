#!/usr/bin/env python3
"""
Test script for optimized st-cytoscape component
"""

import streamlit as st

from st_cytoscape import cytoscape

st.title("🔬 Optimized st-cytoscape Test")

# Test data
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

# Minimal styling
stylesheet = [
    {
        "selector": "node",
        "style": {
            "label": "data(label)",
            "width": 40,
            "height": 40,
            "background-color": "#0074D9",
            "color": "white",
            "text-valign": "center",
            "text-halign": "center",
        },
    },
    {
        "selector": "edge",
        "style": {
            "width": 3,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "line-color": "#85144b",
            "target-arrow-color": "#85144b",
        },
    },
]

st.info(
    "🎮 **Interactive Features**: Use the control panel (top-right) for layout switching and zoom controls!"
)

# Test the optimized component
selected = cytoscape(
    elements,
    stylesheet,
    layout={"name": "fcose", "animationDuration": 800},
    height="500px",
    key="optimized_test",
)

# Display results
if selected["nodes"]:
    st.success(f"✅ Selected nodes: {', '.join(selected['nodes'])}")
if selected["edges"]:
    st.info(f"🔗 Selected edges: {', '.join(selected['edges'])}")

# Test different layouts
col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("Force Layout")
    cytoscape(
        elements[:6],
        stylesheet,
        layout={"name": "fcose"},
        height="200px",
        key="test_force",
    )

with col2:
    st.subheader("Grid Layout")
    cytoscape(
        elements[:6],
        stylesheet,
        layout={"name": "grid"},
        height="200px",
        key="test_grid",
    )

with col3:
    st.subheader("Circle Layout")
    cytoscape(
        elements[:6],
        stylesheet,
        layout={"name": "circle"},
        height="200px",
        key="test_circle",
    )

st.caption(
    "💡 **Accessibility**: All components support full keyboard navigation and screen readers"
)

