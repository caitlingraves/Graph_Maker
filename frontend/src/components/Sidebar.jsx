import React, { useState } from 'react';
import { dijkstra, findBridges, calculateDegrees, calculateComponents } from '../utils/graphUtils';

const Sidebar = ({ elements = [], setElements, setSelectedMode, getGraphInfo, isDirected, setIsDirected }) => {
  const [isBipartite, setIsBipartite] = useState(null);
  const [bridges, setBridges] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [shortestPath, setShortestPath] = useState(null);
  
  
  const addNode = () => setSelectedMode('addNode');
  const addEdge = () => setSelectedMode('addEdge');
  const deleteSelected = () => setSelectedMode('deleteSelected');
  const resetMode = () => setSelectedMode(null);
  const { numVertices, numEdges } = getGraphInfo();
  const [components, setComponents] = useState([]);

  const findShortestPath = () => {
    if (source && target) {
      const result = dijkstra(elements, source, target);
      setShortestPath(result);
    }
  };

  const changeElementColor = (id) => {
    setElements((prev) =>
      prev.map((el) =>
        el.data.id === id ? { ...el, data: { ...el.data, color: selectedColor } } : el
      )
    );
  };

  const changeEdgeColor = (id) => {
    const newColor = prompt('Enter a color (name, hex, or rgb):', '#000000');
    if (newColor) {
      setElements((prev) =>
        prev.map((el) =>
          el.data.id === id ? { ...el, data: { ...el.data, color: newColor } } : el
        )
      );
    }
  };

  const renameEdge = (id) => {
    const newName = prompt('Enter a new name:');
    if (newName) {
      setElements((prev) =>
        prev.map((el) =>
          el.data.id === id ? { ...el, data: { ...el.data, label: newName } } : el
        )
      );
    }
  };

  const changeEdgeWeight = (id) => {
    const newWeight = prompt('Enter a new weight (number):');
    if (!isNaN(newWeight) && newWeight !== null) {
      setElements((prev) =>
        prev.map((el) =>
          el.data.id === id ? { ...el, data: { ...el.data, weight: Number(newWeight) } } : el
        )
      );
    }
  };

  const findComponents = () => {
    const components = calculateComponents(elements);
    setComponents(components);
  };

  const calculateBridges = () => {
    const bridgeEdges = findBridges(elements);
    setBridges(bridgeEdges);
  };
 

  const changeColor = (id) => {
    const newColor = prompt('Enter a color (name, hex, or rgb):', '#000000'); // Prompt user for color
    if (newColor) {
      setElements((prev) =>
        prev.map((el) =>
          el.data.id === id ? { ...el, data: { ...el.data, color: newColor } } : el
        )
      );
    }
  };

  const reName = (id) => {
    const newName = prompt('Enter a new name:'); // Prompt user for color
    if (newName) {
      setElements((prev) =>
        prev.map((el) =>
          el.data.id === id ? { ...el, data: { ...el.data, label: newName } } : el
        )
      );
    }
  };

  // Function to check if graph is bipartite
  const checkBipartite = () => {
    const adjList = {};
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
        if (!adjList[el.data.source]) adjList[el.data.source] = [];
        if (!adjList[el.data.target]) adjList[el.data.target] = [];
        adjList[el.data.source].push(el.data.target);
        adjList[el.data.target].push(el.data.source);
      }
    });

    const colors = {};
    const queue = [];

    for (const node of Object.keys(adjList)) {
      if (colors[node] === undefined) {
        queue.push(node);
        colors[node] = 0;

        while (queue.length > 0) {
          const current = queue.shift();
          const currentColor = colors[current];

          for (const neighbor of adjList[current]) {
            if (colors[neighbor] === undefined) {
              colors[neighbor] = 1 - currentColor;
              queue.push(neighbor);
            } else if (colors[neighbor] === currentColor) {
              setIsBipartite(false);
              return;
            }
          }
        }
      }
    }

    setIsBipartite(true);
  };

  const degrees = calculateDegrees(elements);

  return (
    <div className="sidebar">
      <button onClick={addNode}>Add Vertices</button>
      <button onClick={addEdge}>Add Edges</button>
      <button onClick={deleteSelected}>Delete Selected</button>
      <button onClick={resetMode}>Select Element</button>
      <button onClick={checkBipartite}>Check Bipartite</button>
      <button onClick={() => setIsDirected(!isDirected)}>
        Toggle Directed/Undirected</button>
      <button onClick={findComponents}>Find Components</button>
      <button onClick={calculateBridges}>Find Bridges</button>

      <h3>Graph Information</h3>
      <p>Vertices: {numVertices}</p>
      <p>Edges: {numEdges}</p>

      <h3>Bipartite Check</h3>
      {isBipartite === null ? (
        <p>Click "Check Bipartite" to analyze the graph.</p>
      ) : isBipartite ? (
        <p>The graph is Bipartite.</p>
      ) : (
        <p>The graph is NOT Bipartite.</p>
      )}

<h3>Components</h3>
      {components.length === 0 ? (
        <p>Click "Find Components" to analyze the graph.</p>
      ) : (
        <ul>
          {components.map((component, index) => (
            <li key={index}>
              Component {index + 1}: {component.join(', ')}
            </li>
          ))}
        </ul>
      )}

<h3>Bridge Edges</h3>
      {bridges.length === 0 ? (
        <p>Click "Find Bridges" to analyze the graph.</p>
      ) : (
        <ul>
          {bridges.map((bridge, index) => (
            <li key={index}>
              Bridge: {bridge.source} - {bridge.target}
            </li>
          ))}
        </ul>
      )}

<h3>Shortest Path</h3>
      <div>
        <label>
          Source:
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source node ID"
          />
        </label>
        <label>
          Target:
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target node ID"
          />
        </label>
        <button onClick={findShortestPath}>Find Shortest Path</button>
      </div>

      {shortestPath && (
        <div>
          <h4>Path: {shortestPath.path.join(' -> ')}</h4>
          <p>Total Weight: {shortestPath.distance}</p>
        </div>
      )}

      <h3>Elements</h3>
      <h2>Vertices</h2>
      <ul>
        {elements
          .filter((el) => !el.data.source) // Filter for vertices only
          .map((el) => (
            <li key={el.data.id}>
              <span>{el.data.label || el.data.id}</span>
              Degree: {degrees[el.data.id] || 0}
              <button
                onClick={() =>
                  setElements((prev) => prev.filter((e) => e.data.id !== el.data.id))
                }
              >
                Delete
              </button>
              <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                />
              <button onClick={() => changeElementColor(el.data.id)}>Change Color</button>
              <button onClick={() => reName(el.data.id)}>ReName</button>
            </li>
          ))}
      </ul>
      <h2>Edges</h2>
      <ul>
        {elements
          .filter((el) => el.data.source && el.data.target) // Filter for edges
          .map((el) => (
            <li key={el.data.id}>
              {el.data.label || `${el.data.source} -> ${el.data.target}`}
              {el.data.weight !== undefined && ` (Weight: ${el.data.weight})`}
              <div>
                <button onClick={() => changeEdgeColor(el.data.id)}>Change Color</button>
                <button
                  onClick={() =>
                    setElements((prev) => prev.filter((e) => e.data.id !== el.data.id))
                  }
                >
                  Delete
                </button>
                <button onClick={() => renameEdge(el.data.id)}>Rename</button>
                <button onClick={() => changeEdgeWeight(el.data.id)}>Change Weight</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
