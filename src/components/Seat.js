import React from 'react';

export default (
  {
    disabled,
    onMouseEnter,
    onMouseLeave,
    hovered,
    backgroundColor,
    onToggle
  }
) => (
  <button
    className={`seat ${disabled ? "disabled" : ""} ${hovered ? "hovered" : ""}`}
    onClick={onToggle}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="seat-color" style={{ backgroundColor }} />
  </button>
);
