import os
from typing import Any, Dict, List, Optional

import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component(
        "streamlit_cytoscape",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("streamlit_cytoscape", path=build_dir)


def cytoscape(
    elements: List[Dict[str, Any]],
    stylesheet: List[Dict[str, Any]],
    width: str = "100%",
    height: str = "300px",
    layout: Optional[Dict[str, Any]] = None,
    selection_type: str = "additive",
    user_zooming_enabled: bool = True,
    user_panning_enabled: bool = True,
    min_zoom: float = 1e-50,
    max_zoom: float = 1e50,
    key: Optional[str] = None,
) -> Dict[str, List[str]]:
    """Creates a new instance of a Cytoscape.js graph with interactive controls.

    Args:
        elements: List of nodes and edges (https://js.cytoscape.org/#notation/elements-json)
        stylesheet: Visual styles for the graph (https://js.cytoscape.org/#style)
        width: CSS width of the graph container (default: "100%")
        height: CSS height of the graph container (default: "300px")
        layout: Layout algorithm options (https://js.cytoscape.org/#layouts)
        selection_type: "single" or "additive" selection behavior
        user_zooming_enabled: Allow user zooming interactions
        user_panning_enabled: Allow user panning interactions
        min_zoom: Minimum zoom level
        max_zoom: Maximum zoom level
        key: Unique component identifier for state persistence

    Returns:
        Dictionary with "nodes" and "edges" keys containing selected element IDs
    """

    # Set default layout if not provided
    if layout is None:
        layout = {"name": "fcose", "animationDuration": 0}

    # Validate selection_type parameter
    if selection_type not in ("single", "additive"):
        raise ValueError("selection_type must be 'single' or 'additive'")

    # Extract pre-selected elements efficiently
    selected_nodes = [
        e["data"]["id"]
        for e in elements
        if e.get("selected")
        and e.get("data", {}).get("id")
        and "source" not in e.get("data", {})
    ]
    selected_edges = [
        e["data"]["id"]
        for e in elements
        if e.get("selected")
        and e.get("data", {}).get("id")
        and "source" in e.get("data", {})
    ]

    default = {"nodes": selected_nodes, "edges": selected_edges}

    return _component_func(
        elements=elements,
        stylesheet=stylesheet,
        width=width,
        height=height,
        layout=layout,
        selectionType=selection_type,
        userZoomingEnabled=user_zooming_enabled,
        userPanningEnabled=user_panning_enabled,
        minZoom=min_zoom,
        maxZoom=max_zoom,
        key=key,
        default=default,
    )
