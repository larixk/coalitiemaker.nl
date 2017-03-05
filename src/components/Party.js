import React from "react";

export default (
  {
    party,
    active,
    hovered,
    onMouseEnter,
    onMouseLeave,
    onToggle
  }
) => (
  <a
    className={`party ${active ? "active" : ""} ${hovered ? "hovered" : ""}`}
    onClick={onToggle}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <span className="party-color" style={{ backgroundColor: party.color }} />
    {party.name}
    <span className="party-seats">
      {party.seats}
    </span>
  </a>
);
