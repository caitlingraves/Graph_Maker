// frontend/src/App.js

import React, { useState } from 'react';
import Graph from './components/Graph';
import Sidebar from './components/Sidebar';
import './styles/App.css';

const App = () => {
    const [elements, setElements] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null);
    const [isDirected, setIsDirected] = useState(true);

    const getGraphInfo = () => {
        // Example function for information about the graph
        return {
          numVertices: elements.filter((el) => !el.data.source).length, // Nodes
          numEdges: elements.filter((el) => el.data.source).length, // Edges
        };
      };
  
    return (
      <div className="app">
        <Sidebar 
          elements={elements} 
          setElements={setElements} 
          setSelectedMode={setSelectedMode} 
          getGraphInfo={getGraphInfo}
          isDirected={isDirected}
          setIsDirected={setIsDirected}
        />
        <Graph 
          elements={elements} 
          setElements={setElements} 
          selectedMode={selectedMode} 
          isDirected={isDirected}
        />
      </div>
    );
  };

export default App;
