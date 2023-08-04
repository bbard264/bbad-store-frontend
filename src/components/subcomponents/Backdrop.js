import React from 'react';
import '../../styles/components/subcomponents/Backdrop.css';

export default function Backdrop({ onCancel, children }) {
  const handleBackdropClick = (event) => {
    event.stopPropagation();
    onCancel();
  };
  return (
    <div className="PositionRelativeForBackDrop">
      <div className="BackdropContainer">
        <div className="BackdropBox">
          {children}
          <div
            className="BackdropCancelBox"
            onClick={handleBackdropClick}
          ></div>
        </div>
      </div>
    </div>
  );
}
