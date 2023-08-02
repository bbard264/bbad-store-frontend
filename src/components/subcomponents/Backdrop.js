import React, { Children } from 'react';
import '../../styles/components/subcomponents/Backdrop.css';

export default function Backdrop({ onCancel, children }) {
  return (
    <div className="PositionRelativeForBackDrop">
      <div className="BackdropContainer">
        <div className="BackdropBox">{children}</div>
        <div className="BackdropCancelBox" onClick={onCancel}></div>
      </div>
    </div>
  );
}
