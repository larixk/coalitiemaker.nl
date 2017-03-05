import React from 'react';

export default ({ tweedeKamerCount, eersteKamerCount }) => (
  <div className="party-total">
    {tweedeKamerCount}
    <span className="party-total-ratio">
      {" "}/ 150 ({Math.round(tweedeKamerCount / 1.5)}%)
    </span>
    <span className="party-total-label">
      zetels in de Tweede Kamer
    </span>
    <br />
    {eersteKamerCount}
    <span className="party-total-ratio">
      {" "}/ 75 ({Math.round(eersteKamerCount / 0.75)}%)
    </span>
    <span className="party-total-label">
      zetels in de Eerste Kamer
    </span>
  </div>
)
