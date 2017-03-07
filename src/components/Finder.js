import React, { Component } from "react";

import Party from "./Party";
import Totals from "./Totals";

import calculator from "../util/calculator";

import "./Finder.css";

class Finder extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }
  render() {
    const coalitions = calculator(this.props.parties);
    return (
      <div className="Finder">
        {this.state.expanded
          ? <ul>
              {coalitions.map(coalition => (
                <li
                  onClick={() => this.props.onClick(coalition.parties)}
                  key={coalition.hash}
                  className="coalition"
                >
                  <div className="coalition-parties">
                    {coalition.parties.map(party => <Party key={party.name} party={party} />)}
                  </div>
                  <Totals
                    eersteKamerCount={coalition.eerste}
                    tweedeKamerCount={coalition.seats}
                  />
                </li>
              ))}
            </ul>
          : <div>
              <p>
                Wij hebben alvast alle mogelijke coalities met een meerderheid in Eerste en Tweede Kamer berekend.
              </p>
              <button onClick={() => this.setState({ expanded: true })}>
                Toon alle coalities
              </button>
            </div>}

      </div>
    );
  }
}

export default Finder;
