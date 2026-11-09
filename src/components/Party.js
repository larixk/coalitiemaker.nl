import React from "react";

export default (
  {
    party,
    active,
    hovered,
    table,
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
    {table ? (
      <>
        <span className="party-name">{party.name}</span>
        <span className="party-count">{party.seats || "–"}</span>
        <span className="party-count">{party.eerste || "–"}</span>
      </>
    ) : (
      <>
        {party.name}
        <span className="party-seats">{party.seats}</span>
      </>
    )}
  </a>
);
