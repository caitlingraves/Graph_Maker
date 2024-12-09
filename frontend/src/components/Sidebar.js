import React, { useState } from 'react';

const Sidebar = ({ elements = [], setElements, setSelectedMode, getGraphInfo, isDirected, setIsDirected }) => {
  const [isBipartite, setIsBipartite] = useState(null);
  const [bridges, setBridges] = useState([]);
  
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

  const dijkstra = (elements, sourceId, targetId) => {
    const adjList = {};
    const distances = {};
    const previous = {};
    const unvisited = new Set();
  
    // Build adjacency list
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
        // It's an edge
        if (!adjList[el.data.source]) adjList[el.data.source] = [];
        if (!adjList[el.data.target]) adjList[el.data.target] = [];
        adjList[el.data.source].push({ node: el.data.target, weight: el.data.weight || 1 });
        adjList[el.data.target].push({ node: el.data.source, weight: el.data.weight || 1 }); // If undirected
      }
    });
  
    // Initialize distances and unvisited set
    Object.keys(adjList).forEach((node) => {
      distances[node] = Infinity;
      previous[node] = null;
      unvisited.add(node);
    });
    distances[sourceId] = 0;
  
    // Priority queue helper
    const getClosestNode = () => {
      let closestNode = null;
      let smallestDistance = Infinity;
      unvisited.forEach((node) => {
        if (distances[node] < smallestDistance) {
          closestNode = node;
          smallestDistance = distances[node];
        }
      });
      return closestNode;
    };
  
    // Dijkstra's algorithm
    while (unvisited.size > 0) {
      const currentNode = getClosestNode();
      if (currentNode === null) break; // All remaining nodes are unreachable
      if (currentNode === targetId) break; // Target reached
  
      unvisited.delete(currentNode);
  
      adjList[currentNode].forEach(({ node: neighbor, weight }) => {
        if (unvisited.has(neighbor)) {
          const newDistance = distances[currentNode] + weight;
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = currentNode;
          }
        }
      });
    }
  
    // Reconstruct shortest path
    const path = [];
    let currentNode = targetId;
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }
  
    return {
      path,
      distance: distances[targetId],
    };
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

  const findBridges = (elements) => {
    const adjList = {};
    const bridges = [];
    const visited = new Set();
    const discovery = {};
    const low = {};
    let time = 0;
  
    // Build adjacency list
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
        if (!adjList[el.data.source]) adjList[el.data.source] = [];
        if (!adjList[el.data.target]) adjList[el.data.target] = [];
        adjList[el.data.source].push(el.data.target);
        adjList[el.data.target].push(el.data.source); // Undirected graph
      }
    });
  
    // DFS function
    const dfs = (u, parent) => {
      visited.add(u);
      discovery[u] = low[u] = ++time;
  
      for (const v of adjList[u] || []) {
        if (!visited.has(v)) {
          dfs(v, u);
  
          // Update low value of `u` based on `v`
          low[u] = Math.min(low[u], low[v]);
  
          // Check if the edge `(u, v)` is a bridge
          if (low[v] > discovery[u]) {
            bridges.push({ source: u, target: v });
          }
        } else if (v !== parent) {
          // Update low value for back edges
          low[u] = Math.min(low[u], discovery[v]);
        }
      }
    };
  
    // Run DFS from all unvisited nodes
    Object.keys(adjList).forEach((node) => {
      if (!visited.has(node)) {
        dfs(node, null);
      }
    });
  
    return bridges;
  };
  

  const calculateDegrees = () => {
    const degrees = {};
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
        // It's an edge
        degrees[el.data.source] = (degrees[el.data.source] || 0) + 1;
        degrees[el.data.target] = (degrees[el.data.target] || 0) + 1;

        // If it's a loop, count it twice
        if (el.data.source === el.data.target) {
          degrees[el.data.source] += 1;
        }
      }
    });
    return degrees;
  };

  const calculateComponents = (elements) => {
    const adjList = {};
  
    // Build adjacency list
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
        // It's an edge
        if (!adjList[el.data.source]) adjList[el.data.source] = [];
        if (!adjList[el.data.target]) adjList[el.data.target] = [];
        adjList[el.data.source].push(el.data.target);
        adjList[el.data.target].push(el.data.source);
      }
    });
  
    const visited = new Set();
    const components = [];
  
    // Helper function for DFS
    const dfs = (node, component) => {
      visited.add(node);
      component.push(node);
      if (adjList[node]) {
        adjList[node].forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            dfs(neighbor, component);
          }
        });
      }
    };
  
    // Find all components
    Object.keys(adjList).forEach((node) => {
      if (!visited.has(node)) {
        const component = [];
        dfs(node, component);
        components.push(component);
      }
    });
  
    return components;
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

  const degrees = calculateDegrees();

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
              <button onClick={() => changeColor(el.data.id)}>Change Color</button>
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
