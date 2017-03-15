import React, { Component } from 'react';

import Party from './Party';
import Totals from './Totals';

import calculator from '../util/calculator';

import './Finder.css';

class Finder extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
  }
  render() {
    const coalitions = this.state.expanded
      ? calculator(this.props.parties).filter(
          coalition => coalition.parties.length <= this.state.expanded,
        )
      : [];
    console.log(coalitions.map(c => c.hash));
    console.log(coalitions);
    let previousCoalitionSize = null;
    return (
      <div className="Finder">
        <h2>Mogelijke coalities</h2>
        <ul>
          {coalitions.map(coalition => {
            let className = 'coalition';
            if (coalition.parties.length !== previousCoalitionSize) {
              previousCoalitionSize = coalition.parties.length;
              className += ' coalition-first-of-group';
            }
            return (
              <li
                onClick={() => this.props.onClick(coalition.parties)}
                key={coalition.hash}
                className={className}
              >
                <div className="coalition-parties">
                  {coalition.parties.map(party => (
                    <Party key={party.name} party={party} />
                  ))}
                </div>
                <Totals
                  eersteKamerCount={coalition.eerste}
                  tweedeKamerCount={coalition.seats}
                />
              </li>
            );
          })}
        </ul>
        <div>
          {this.state.expanded
            ? null
            : <p>
                Wij hebben alvast alle mogelijke coalities met een meerderheid in Eerste en Tweede Kamer berekend.
              </p>}
          {this.state.expanded
            ? this.state.expanded < 6
                ? <button
                    onClick={() =>
                      this.setState({ expanded: this.state.expanded + 1 })}
                  >
                    Toon coalities met {this.state.expanded + 1} partijen
                  </button>
                : null
            : <button onClick={() => this.setState({ expanded: 4 })}>
                Toon mogelijke coalities
              </button>}
        </div>

      </div>
    );
  }
}

export default Finder;
