import React, {Component} from 'react';

import Party from './Party';
import Totals from './Totals';

import calculator from '../util/calculator';

import './Finder.css';

class Finder extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      excludedParties: [],
    };
  }
  render() {
    console.log(this.state.excludedParties);
    const coalitions = calculator(this.props.parties).filter(coalition =>
      coalition.parties.every(
        party => !this.state.excludedParties.includes(party),
      ));
    let previousCoalitionSize = null;
    return (
      <div className="Finder">
        <h2>Mogelijke coalities</h2>
        {this.state.expanded
          ? <div>
              <div className="toggles">
                <p>
                  Selecteer partijen om coalities mee te nemen in de berekeningen:
                </p>
                {this.props.parties.map(party => (
                  <button
                    key={party.name}
                    onClick={() => {
                      this.setState({
                        excludedParties: this.state.excludedParties.includes(
                          party,
                        )
                          ? this.state.excludedParties.filter(
                              excludedParty => excludedParty !== party,
                            )
                          : this.state.excludedParties.concat([party]),
                      });
                    }}
                    className={
                      'toggle' +
                        (!this.state.excludedParties.includes(party)
                          ? ' toggle-active'
                          : '')
                    }
                  >
                    {party.name}
                  </button>
                ))}
                <h3>{coalitions.length} coalitie{coalitions.length === 1 ? '' : 's'} met een meerderheid in Eerste en Tweede Kamer gevonden</h3>
              </div>
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
            </div>
          : (<div>
            <p>
              Wij hebben alvast alle mogelijke coalities met een meerderheid in Eerste en Tweede Kamer berekend.
            </p><button
              onClick={() =>
                this.setState({expanded: true})}
            >
              Toon mogelijke coalities
            </button></div>)}
      </div>
    );
  }
}

export default Finder;
