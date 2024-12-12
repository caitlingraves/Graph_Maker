// Dijkstra's Algorithm
export const dijkstra = (elements, sourceId, targetId) => {
    const adjList = {};
    const distances = {};
    const previous = {};
    const unvisited = new Set();
  
    // Build adjacency list
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
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
  
  // Find Bridges
  export const findBridges = (elements) => {
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
  
  // Calculate Components
  export const calculateComponents = (elements) => {
    const adjList = {};
  
    // Build adjacency list
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
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
  
  // Check if a graph is bipartite
  export const checkBipartite = (elements, setIsBipartite) => {
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
  
  // Calculate Degrees
  export const calculateDegrees = (elements) => {
    const degrees = {};
    elements.forEach((el) => {
      if (el.data.source && el.data.target) {
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
  