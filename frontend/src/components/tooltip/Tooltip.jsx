// frontend\src\components\tooltip\Tooltip.jsx
import React from 'react';

const Tooltip = ({ position, text, collapsed }) => {
  return (
    <div
      className="absolute bg-gray-700 text-white text-xs rounded p-1"
      style={{
        top: position.top + 'px',
        // Conditional left positioning based on theme mode (light or dark)
        left: collapsed ? position.left + 5 + 'px' : position.left + 140 + 'px',
        transform: 'translateY(-50%)',
        zIndex: 1000, // Ensure it's on top
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export default Tooltip;
