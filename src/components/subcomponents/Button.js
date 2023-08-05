import React from 'react';
import '../../styles/components/subcomponents/Button.css';

function Button({
  type,
  className,
  form,
  onClick,
  children,
  isDisabled = false,
}) {
  let thisType = type;
  let thisColor = type;
  if (type === 'submit&green') {
    thisType = 'submit';
    thisColor = 'green';
  }
  return (
    <button
      className={`Button${` ` + className + ` ` + thisColor}${
        isDisabled ? ' disabled' : ''
      }`}
      type={thisType}
      form={form}
      onClick={isDisabled ? null : onClick}
    >
      {children}
    </button>
  );
}

export default Button;
