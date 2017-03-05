import React, { Component } from "react";
import Footer from "./Footer";
import "./App.css";

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const Seat = (
  {
    disabled,
    onMouseEnter,
    onMouseLeave,
    hovered,
    backgroundColor,
    animationDelay,
    onToggle
  }
) => (
  <button
    className={`seat ${hovered && "hovered"}`}
    disabled={disabled}
    onClick={onToggle}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ animationDelay }}
  >
    <div className="seat-color" style={{ backgroundColor }} />
  </button>
);

const Party = (
  {
    party,
    active,
    hovered,
    backgroundColor,
    onMouseEnter,
    onMouseLeave,
    onToggle
  }
) => (
  <a
    className={`party ${active && "active"} ${hovered && "hovered"}`}
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

const parties = [
  {
    name: "PVV",
    seats: 29,
    color: "#2e89b5"
  },
  {
    name: "VVD",
    seats: 25,
    color: "#ff7600"
  },
  {
    name: "CDA",
    seats: 18,
    color: "#6ab651"
  },
  {
    name: "GroenLinks",
    seats: 18,
    color: "#82bb00"
  },
  {
    name: "D66",
    seats: 14,
    color: "#a7e5c0"
  },
  {
    name: "PvdA",
    seats: 12,
    color: "#e2001a"
  },
  {
    name: "SP",
    seats: 11,
    color: "#fe2b24"
  },
  {
    name: "50PLUS",
    seats: 6,
    color: "#7f1382"
  },
  {
    name: "ChristenUnie",
    seats: 5,
    color: "#26a2ec"
  },
  {
    name: "Overig",
    seats: 5,
    color: "#808080"
  },
  {
    name: "Partij vd Dieren",
    seats: 4,
    color: "#006b2d"
  },
  {
    name: "SGP",
    seats: 3,
    color: "#f37022"
  }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      active: []
    };
  }
  render() {
    const active = parties.filter(party => this.state.active.includes(party));
    const inactive = parties.filter(party => !active.includes(party));
    const activeSum = active.reduce((seats, party) => seats + party.seats, 0);
    let previousParty = null;
    return (
      <div className="App">
        <h1>coalitiemaker</h1>
        <div className="seats">
          <div className="seats-group">
            {inactive.reduce(
              (seats, party) => seats.concat(
                times(party.seats, i => (
                  <Seat
                    onMouseEnter={() => this.setState({
                      hovered: party
                    })}
                    onMouseLeave={() => this.setState({
                      hovered: null
                    })}
                    hovered={this.state.hovered === party}
                    key={party.name + "-" + i}
                    backgroundColor={party.color}
                    animationDelay={i * 0.01 + "s"}
                    onToggle={() => this.setState({
                      hovered: null,
                      active: active.concat([party])
                    })}
                  />
                ))
              ),
              []
            )}
            {times(activeSum, i => (
              <Seat
                key={"required-" + i}
                backgroundColor="#eee"
                disabled={true}
              />
            ))}
          </div>
          <div className="seats-group">
            {active.reduce(
              (seats, party) => seats.concat(
                times(party.seats, i => {
                  const firstOfParty = party !== previousParty;
                  previousParty = party;
                  return (
                    <Seat
                      onMouseEnter={() => this.setState({
                        hovered: party
                      })}
                      onMouseLeave={() => this.setState({
                        hovered: null
                      })}
                      hovered={this.state.hovered === party}
                      firstOfParty={firstOfParty}
                      key={party.name + "-" + i}
                      backgroundColor={party.color}
                      animationDelay={i * 0.01 + "s"}
                      onToggle={() => this.setState({
                        hovered: null,
                        active: active.filter(
                          activeParty => activeParty !== party
                        )
                      })}
                    />
                  );
                })
              ),
              []
            )}
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
            <div>
              {inactive.map(party => (
                <Party
                  active={false}
                  party={party}
                  key={party.name}
                  onToggle={() => this.setState({
                    hovered: null,
                    active: active.concat([party])
                  })}
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
          </div>
          <div className="party-group party-group-active">
            <div>
              {active.length
                ? active.map(party => (
                    <Party
                      active={true}
                      party={party}
                      key={party.name}
                      onToggle={() => this.setState({
                        hovered: null,
                        active: active.filter(
                          activeParty => activeParty !== party
                        )
                      })}
                      onMouseEnter={() => this.setState({
                        hovered: party
                      })}
                      onMouseLeave={() => this.setState({
                        hovered: null
                      })}
                      hovered={this.state.hovered === party}
                    />
                  ))
                : <span className="party-group-empty">
                    geen partijen geselecteerd
                  </span>}
            </div>
            <div className="party-total">{activeSum} zetels</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
