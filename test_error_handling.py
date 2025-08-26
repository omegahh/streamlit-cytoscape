#!/usr/bin/env python3
"""
Test script to verify improved error handling in streamlit-cytoscape
This script intentionally triggers various error conditions to test the improved error messages.
"""

import os
import sys

import streamlit as st

sys.path.insert(0, os.path.dirname(__file__))

from streamlit_cytoscape import cytoscape

st.title("Error Handling Test")

st.write("This app tests improved error handling. Choose an error type to trigger:")

error_type = st.selectbox(
    "Select error type:",
    [
        "No error (working example)",
        "Missing elements",
        "Invalid elements type",
        "Empty elements array",
        "Invalid element structure",
        "Invalid stylesheet",
    ],
)

if error_type == "No error (working example)":
    st.write("### Working Example")
    elements = [
        {"data": {"id": "one", "label": "Node 1"}, "position": {"x": 50, "y": 50}},
        {"data": {"id": "two", "label": "Node 2"}, "position": {"x": 200, "y": 200}},
        {"data": {"source": "one", "target": "two", "label": "Edge 1-2"}},
    ]
    stylesheet = [
        {
            "selector": "node",
            "style": {
                "content": "data(label)",
                "text-valign": "center",
                "text-halign": "center",
            },
        },
        {
            "selector": "edge",
            "style": {"curve-style": "bezier", "target-arrow-shape": "triangle"},
        },
    ]
    cytoscape(elements, stylesheet, width="600px", height="400px")

elif error_type == "Missing elements":
    st.write("### Testing: Missing elements parameter")
    st.code("cytoscape(None, [])")  # This should show error
    try:
        cytoscape(None, [])
    except Exception as e:
        st.error(f"Python error caught: {e}")

elif error_type == "Invalid elements type":
    st.write("### Testing: Invalid elements type")
    st.code('cytoscape("not_an_array", [])')  # This should show error
    try:
        cytoscape("not_an_array", [])
    except Exception as e:
        st.error(f"Python error caught: {e}")

elif error_type == "Empty elements array":
    st.write("### Testing: Empty elements array")
    st.code("cytoscape([], [])")  # This should show error
    cytoscape([], [])

elif error_type == "Invalid element structure":
    st.write("### Testing: Invalid element structure")
    st.code('cytoscape([{"invalid": "structure"}], [])')  # This should show error
    cytoscape([{"invalid": "structure"}], [])

elif error_type == "Invalid stylesheet":
    st.write("### Testing: Invalid stylesheet")
    st.code(
        'cytoscape([{"data": {"id": "test"}}], "invalid_stylesheet")'
    )  # This should show error
    try:
        cytoscape([{"data": {"id": "test"}}], "invalid_stylesheet")
    except Exception as e:
        st.error(f"Python error caught: {e}")

st.write("---")
st.write(
    "**Note**: With improved error handling, you should now see detailed error messages directly in the component area, including:"
)
st.write("- Specific error descriptions")
st.write("- Context about where the error occurred")
st.write("- Stack traces (expandable)")
st.write("- Actionable error messages instead of just 'Check console for details'")

