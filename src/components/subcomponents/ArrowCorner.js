import React from 'react';
import '../../styles/components/subcomponents/ArrowCorner.css';

export default function ArrowCorner({
  direction,
  onClick,
  id,
  children,
  className,
}) {
  return (
    <div
      className={`${direction}Corner ${className ?? ''}`}
      onClick={() => onClick(direction)}
      id={id}
    >
      {direction === 'left' ? (
        <>
          <div className="arrow-left"></div>
          {children}
        </>
      ) : (
        <>
          <div className="arrow-right"></div>
          {children}
        </>
      )}
    </div>
  );
}
//<Corner direction="left" onClick={() => handleCornerClick('left')} />
//<Corner direction="right" onClick={() => handleCornerClick('right')} />
