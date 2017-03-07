import React, { Component } from "react";
import Footer from "./Footer";
import Seat from "./Seat";
import Party from "./Party";
import Totals from "./Totals";
import Finder from "./Finder";
import "./App.css";

import parties from "../parties";
import times from "../util/times";

class App extends Component {
  constructor() {
    super();
    this.state = {
      active: []
    };
  }

  toggleParty(party) {
    this.setState({
      hovered: null,
      active: this.state.active.includes(party)
        ? this.state.active.filter(activeParty => activeParty !== party)
        : this.state.active.concat([party])
    });
  }

  renderPartyList({ parties, isActive }) {
    return (
      <div>
        {parties.map(party => (
          <Party
            active={isActive}
            party={party}
            key={party.name}
            onToggle={() => this.toggleParty(party)}
            onMouseEnter={() => this.setState({
              hovered: party
            })}
            onMouseLeave={() => this.setState({
              hovered: null
            })}
            hovered={this.state.hovered === party}
          />
        ))}
      </div>
    );
  }

  renderSeats({ parties }) {
    return parties.reduce(
      (seats, party) => seats.concat(
        times(party.seats, i => (
          <Seat
            onToggle={() => this.toggleParty(party)}
            onMouseEnter={() => this.setState({
              hovered: party
            })}
            onMouseLeave={() => this.state.hovered &&
            this.state.hovered === party &&
            this.setState({
              hovered: null
            })}
            hovered={this.state.hovered === party}
            key={party.name + "-" + i}
            backgroundColor={party.color}
            animationDelay={i * 0.01 + "s"}
          />
        ))
      ),
      []
    );
  }

  render() {
    const active = parties.filter(
      party => this.state.active.includes(party) || party === this.state.hovered
    );
    const inactiveParties = parties.filter(
      party => !this.state.active.includes(party)
    );
    const activeSum = active.reduce((seats, party) => seats + party.seats, 0);
    return (
      <div className="App">
        <div className="Header">
        <h1>coalitiemaker</h1>
        <p>Coalitiemaker maakt de mogelijke coalities in de Nederlandse Tweede Kamer inzichtelijk. Op dit moment op basis van de peilingen. Vanaf 16 maart op basis van de daadwerkelijke verkiezingsresultaten.</p>
        </div>
        <div className="seats">
          <div className="seats-group">
            {this.renderSeats({ parties: inactiveParties })}
            {times(
              activeSum -
                (this.state.hovered &&
                  !this.state.active.includes(this.state.hovered)
                  ? this.state.hovered.seats
                  : 0),
              i => (
                <Seat
                  key={"required-" + i}
                  backgroundColor="#eee"
                  animationDelay={i * 0.01 + "s"}
                  disabled={true}
                />
              )
            )}
          </div>
          <div className="seats-group seats-group-active">
            {this.renderSeats({ parties: active })}
            {times(75 - activeSum, i => (
              <Seat
                key={"required-" + (75 - activeSum - i)}
                backgroundColor="#eee"
                animationDelay={i * 0.01 + "s"}
                disabled={true}
              />
            ))}
          </div>
        </div>
        <div className="parties">
          <div className="party-group">
            {this.renderPartyList({
              parties: inactiveParties,
              isActive: false
            })}
          </div>
          <div className="party-group party-group-active">
            {active.length
              ? <div>
                  <div>
                    {this.renderPartyList({
                      parties: active,
                      isActive: true
                    })}
                  </div>
                  <Totals
                    eersteKamerCount={active.reduce(
                      (seats, party) => seats + party.eerste,
                      0
                    )}
                    tweedeKamerCount={active.reduce(
                      (seats, party) => seats + party.seats,
                      0
                    )}
                  />
                </div>
              : <span className="party-group-empty">
                  geen partijen geselecteerd
                </span>}
          </div>
        </div>
        <Finder
          onClick={parties => {
            this.setState({
              active: parties
            });
            window.scrollTo(0,0);
          }}
          parties={parties}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
