import React, { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

const Graph = ({ elements, setElements, selectedMode, isDirected }) => {
  const cyRef = useRef(null);
  const nodeIDRef = useRef(1);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeSource, setEdgeSource] = useState(null);

  let lastTap = 0;

  

  const handleSelectEdge = (event) => {
    const selected = event.target;
    if (selected.isEdge()) {
      setSelectedEdge(selected.data());
    }
  };

  const handleUnselectEdge = () => {
    setSelectedEdge(null);
  };

  const handleAddNode = (event) => {
    if (selectedMode === "addNode") {
      const id = `node-${nodeIDRef.current}`;
      nodeIDRef.current += 1;
      const newNode = { data: { id, label: id }, position: event.position };
      setElements((prev) => [...prev, newNode]);
    }
  };

  const handleTapNode = (event) => {
    if (selectedMode === "addEdge") {
      const source = cyRef.current.selectedNodes[0]?.id();
      const target = event.target.id();

      if (source && source !== target) {
        const id = `edge-${source}-${target}`;
        const newEdge = { data: { id, source, target } };
        setElements((prev) => [...prev, newEdge]);
      }
    }
  };

  const handleDeleteSelected = (event) => {
    if (selectedMode === 'deleteSelected') {
      const targetId = event.target.id();

      setElements((prev) =>
        prev.filter((el) => el.data.id !== targetId) // Remove the selected element
      );
    }
  };

  const handleAddEdge = (event) => {
    if (selectedMode === 'addEdge' && event.target.isNode()) {
      const targetNode = event.target.id();

      if (!edgeSource) {
        // First node clicked
        setEdgeSource(targetNode);
      } else {
        const id = `edge-${edgeSource}-${targetNode}`;
  
        if (edgeSource === targetNode) {
          // Create a loop if the source and target are the same
          const newLoop = { data: { id: `loop-${targetNode}`, source: targetNode, target: targetNode } };
          setElements((prev) => [...prev, newLoop]);
        } else {
          // Create a regular edge if source and target are different
          const newEdge = { data: { id, source: edgeSource, target: targetNode } };
          setElements((prev) => [...prev, newEdge]);
        }
  
        setEdgeSource(null); // Reset the source
      }
    }
  };

  useEffect(() => {
    const cy = cyRef.current;

    if (cy) {
      cy.on("tap", handleAddNode);
      cy.on("select", "edge", handleSelectEdge);
      cy.on("unselect", "edge", handleUnselectEdge);
      cy.on('tap', 'node', handleAddEdge);
      cy.on('tap', handleDeleteSelected);
    }

    return () => {
      if (cy) {
        cy.removeListener("tap", handleAddNode);
        cy.removeListener('tap', 'node', handleAddEdge);
        cy.removeListener("select", "edge", handleSelectEdge);
        cy.removeListener("unselect", "edge", handleUnselectEdge);
        cy.removeListener('tap', handleDeleteSelected);
      }
    };
  }, [selectedMode, setElements, edgeSource]);

  return (
    <CytoscapeComponent
      cy={(cy) => {
        cyRef.current = cy;
      }}
      elements={elements}
      style={{ width: '80%', height: '100%' }}
      stylesheet={[
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)', // Use the `color` property from the element
            label: 'data(label)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': 'data(color)',
            'target-arrow-color': isDirected ? 'data(color)' : 'none',
            'target-arrow-shape': isDirected ? 'triangle' : 'none',
            'curve-style': 'bezier',
            label: 'data(weight)',
          },
        },
      ]}
    />
  );
};

export default Graph;
