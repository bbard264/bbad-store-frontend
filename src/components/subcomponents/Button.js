import React from 'react';
import '../../styles/components/subcomponents/Button.css';

function Button({
  type = 'button', // Set type to an empty string by default
  className,
  form,
  onClick,
  children,
  isDisabled = false,
}) {
  let thisType = type;
  let thisColor = '';

  if (type === 'submit&green') {
    thisType = 'submit';
    thisColor = ' green';
  }

  return (
    <button
      className={`Button${className ? ` ${className}` : ''} ${
        thisType === 'button' ? '' : thisType
      }${thisColor}${isDisabled ? ' disabled' : ''}`}
      type={thisType}
      form={form}
      onClick={isDisabled ? null : onClick ? onClick : null}
    >
      {children}
    </button>
  );
}

export default Button;
