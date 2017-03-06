import React, { Component } from "react";

import Party from "./Party";

import calculator from "../util/calculator";

import "./Finder.css";

class Finder extends Component {
  render() {
    const coalitions = calculator(this.props.parties);
    return (
      <div className="Finder">
        <h1>
          alle technisch mogelijke coalities met een meerderheid in Eerste en Tweede Kamer
        </h1>
        <table>
          <tbody>
            {coalitions.map(coalition => (
              <tr onClick={() => this.props.onClick(coalition.parties)} key={coalition.hash} className="coalition">
                <td className="coalition-total">
                  {coalition.parties.length}&nbsp;partijen
                </td>
                <td>
                  {coalition.parties.map(party => <Party party={party} />)}
                </td>
                <td className="coalition-total">
                  {coalition.seats}&nbsp;zetels in tweede kamer
                </td>
                <td className="coalition-total">
                  {coalition.eerste}&nbsp;zetels in eerste kamer
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Finder;
