import React from 'react';
import '../../styles/components/subcomponents/ArrowCorner.css';

export default function ArrowCorner({ direction, onClick, id }) {
  return (
    <div className={`${direction}Corner`} onClick={onClick} id={id}>
      {direction === 'left' ? (
        <div className="arrow-left"></div>
      ) : (
        <div className="arrow-right"></div>
      )}
    </div>
  );
}
//<Corner direction="left" onClick={() => handleCornerClick('left')} />
//<Corner direction="right" onClick={() => handleCornerClick('right')} />
