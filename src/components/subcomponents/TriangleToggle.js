import React from 'react';
import '../../styles/components/subcomponents/TriangleToggle.css';

export default function TriangleToggle({ direction, onClick }) {
  return (
    <div className="triangleBox" onClick={onClick}>
      <div className={`triangleToggle ${direction}`}></div>
    </div>
  );
}
