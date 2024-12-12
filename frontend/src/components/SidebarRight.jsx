import React, { useState } from 'react';
import { calculateDegrees } from '../utils/graphUtils';

const SidebarRight = ({ elements = [], setElements, setSelectedMode, getGraphInfo, isDirected, setIsDirected }) => {
    const [selectedColor, setSelectedColor] = useState('#000000');

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

      const degrees = calculateDegrees(elements);

  
    return (
    <div className="sidebar right-sidebar">
      <h3>Vertices</h3>
      <ul className="scrollable-list">
        {elements
          .filter((el) => !el.data.source) // Only vertices
          .map((el) => (
            <li key={el.data.id} className="element-item">
              <span>{el.data.label || el.data.id}</span>
              Degree: {degrees[el.data.id] || 0}
              <button
                onClick={() =>
                  setElements((prev) => prev.filter((e) => e.data.id !== el.data.id))
                }
              >
                Delete
              </button>              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <button onClick={() => changeElementColor(el.data.id)}>Change Color</button>
              <button onClick={() => reName(el.data.id)}>Rename</button>
            </li>
          ))}
      </ul>

      <h3>Edges</h3>
      <ul className="scrollable-list">
        {elements
          .filter((el) => el.data.source && el.data.target) // Only edges
          .map((el) => (
            <li key={el.data.id} className="element-item">
              <span>
                {el.data.label || `${el.data.source} → ${el.data.target}`}
                {el.data.weight !== undefined && ` (Weight: ${el.data.weight})`}
              </span>
              <button
                  onClick={() =>
                    setElements((prev) => prev.filter((e) => e.data.id !== el.data.id))
                  }
                >
                  Delete
                </button>              <button onClick={() => changeEdgeColor(el.data.id)}>Change Color</button>
              <button onClick={() => renameEdge(el.data.id)}>Rename</button>
              <button onClick={() => changeEdgeWeight(el.data.id)}>Change Weight</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SidebarRight;
