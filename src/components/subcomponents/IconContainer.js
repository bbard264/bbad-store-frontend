import React from 'react';
import '../../styles/components/subcomponents/IconContainer.css';

export default function IconContainer({ src, alt, className }) {
  return (
    <div className={`iconContainer ${className ? className : ''}`}>
      <img src={src} alt={alt} />
    </div>
  );
}
