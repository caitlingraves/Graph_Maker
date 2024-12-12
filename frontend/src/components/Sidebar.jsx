import React, { useState } from 'react';
import { dijkstra, findBridges, calculateDegrees, calculateComponents } from '../utils/graphUtils';

const Sidebar = ({ elements = [], setElements, setSelectedMode, getGraphInfo, isDirected, setIsDirected }) => {
  const [isBipartite, setIsBipartite] = useState(null);
  const [bridges, setBridges] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const [componentsAnalyzed, setComponentsAnalyzed] = useState(false);
  const [bridgesAnalyzed, setBridgesAnalyzed] = useState(false);

  
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

  const findComponents = () => {
    const components = calculateComponents(elements);
    setComponents(components);
  };

  const calculateBridges = () => {
    const bridgeEdges = findBridges(elements);
    setBridges(bridgeEdges);
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
      {!componentsAnalyzed ? (
        <p>Click "Find Components" to analyze the graph.</p>
      ) : components.length === 0 ? (
        <p>No components found.</p>
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
      {!bridgesAnalyzed ? (
        <p>Click "Find Bridges" to analyze the graph.</p>
      ) : bridges.length === 0 ? (
        <p>No bridges found.</p>
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
    </div>
  );
};

export default Sidebar;