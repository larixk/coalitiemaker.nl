import React, { Component } from "react";

import Party from "./Party";
import Totals from "./Totals";

import calculator from "../util/calculator";

import "./Finder.css";

class Finder extends Component {
  constructor() {
    super();
    this.state = {
      limit: 3,
      houseRequirements: [2],
      excludedParties: [],
    };
  }
  render() {
    const coalitions = calculator(this.state.houseRequirements)(
      this.props.parties
    )
      .filter((coalition) =>
        coalition.parties.every(
          (party) => !this.state.excludedParties.includes(party)
        )
      )
      .filter((coalition) => coalition.parties.length <= this.state.limit);
    let previousCoalitionSize = null;
    return (
      <div className="Finder">
        <h2>Automatisch mogelijke coalities berekenen</h2>
        <div className="toggles">
          <p>
            Selecteer alle partijen om mee te nemen en wij berekenen alle
            mogelijke coalities met een meerderheid in Tweede en/of Eerste
            Kamer:
          </p>
          {this.props.parties.map((party) => (
            <button
              key={party.name}
              onClick={() => {
                this.setState({
                  excludedParties: this.state.excludedParties.includes(party)
                    ? this.state.excludedParties.filter(
                        (excludedParty) => excludedParty !== party
                      )
                    : this.state.excludedParties.concat([party]),
                });
              }}
              className={
                "toggle" +
                (!this.state.excludedParties.includes(party)
                  ? " toggle-active"
                  : "")
              }
            >
              {party.name}
            </button>
          ))}
          <p>Maximaal aantal partijen in een coalitie:</p>
          <button
            onClick={() => this.setState({ limit: 3 })}
            className={
              "toggle" + (this.state.limit === 3 ? " toggle-active" : "")
            }
          >
            3 Partijen
          </button>
          <button
            onClick={() => this.setState({ limit: 4 })}
            className={
              "toggle" + (this.state.limit === 4 ? " toggle-active" : "")
            }
          >
            4 Partijen
          </button>
          <button
            onClick={() => this.setState({ limit: 5 })}
            className={
              "toggle" + (this.state.limit === 5 ? " toggle-active" : "")
            }
          >
            5 Partijen
          </button>
          <button
            onClick={() => this.setState({ limit: 6 })}
            className={
              "toggle" + (this.state.limit === 6 ? " toggle-active" : "")
            }
          >
            6 Partijen
          </button>
          <p>Meerderheid in:</p>
          <button
            onClick={() =>
              this.setState({
                houseRequirements: this.state.houseRequirements.includes(2)
                  ? this.state.houseRequirements.length === 2
                    ? [1]
                    : [2]
                  : this.state.houseRequirements.concat([2]),
              })
            }
            className={
              "toggle" +
              (this.state.houseRequirements.includes(2) ? " toggle-active" : "")
            }
          >
            Tweede Kamer
          </button>
          <button
            onClick={() =>
              this.setState({
                houseRequirements: this.state.houseRequirements.includes(1)
                  ? this.state.houseRequirements.length === 2
                    ? [2]
                    : [1]
                  : this.state.houseRequirements.concat([1]),
              })
            }
            className={
              "toggle" +
              (this.state.houseRequirements.includes(1) ? " toggle-active" : "")
            }
          >
            Eerste Kamer
          </button>
        </div>
        <h3>
          {coalitions.length} coalitie
          {coalitions.length === 1 ? "" : "s"}{" "}
          {this.state.houseRequirements.length > 0 &&
            `met een meerderheid in ${
              this.state.houseRequirements.length > 1 ? `zowel ` : ``
            }${this.state.houseRequirements.includes(2) ? `Tweede` : ``}${
              this.state.houseRequirements.length > 1 ? ` als ` : ``
            }${
              this.state.houseRequirements.includes(1) ? `Eerste` : ``
            } Kamer gevonden`}
        </h3>
        <ul>
          {coalitions.map((coalition) => {
            let className = "coalition";
            if (coalition.parties.length !== previousCoalitionSize) {
              previousCoalitionSize = coalition.parties.length;
              className += " coalition-first-of-group";
            }
            return (
              <li
                onClick={() => this.props.onClick(coalition.parties)}
                key={coalition.hash}
                className={className}
              >
                <div className="coalition-parties">
                  {coalition.parties.map((party) => (
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
    );
  }
}

export default React.memo(Finder);
