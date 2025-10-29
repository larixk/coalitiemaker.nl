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
    const hashParties = window.location.hash
      ? decodeURI(window.location.hash.substr(1)).split("+")
      : [];

    this.state = {
      active: parties.filter((party) => hashParties.includes(party.name)),
    };
  }

  handleClickFinder(parties) {
    console.log(parties);
    this.setState(
      {
        active: parties,
      },
      () => {
        window.location.hash = this.state.active
          .map((party) => party.name)
          .join("+");
      }
    );
    window.scrollTo(0, 0);
  }

  toggleParty(party) {
    this.setState(
      {
        hovered: null,
        active: this.state.active.includes(party)
          ? this.state.active.filter((activeParty) => activeParty !== party)
          : this.state.active.concat([party]),
      },
      () => {
        window.location.hash = this.state.active
          .map((party) => party.name)
          .join("+");
      }
    );
  }

  renderPartyList({ parties, isActive }) {
    return (
      <div className="party-group-list">
        {parties.map((party) => (
          <Party
            active={isActive}
            party={party}
            key={party.name}
            onToggle={() => this.toggleParty(party)}
            onMouseEnter={() =>
              !window.hasTouched &&
              this.setState({
                hovered: party,
              })
            }
            onMouseLeave={() =>
              !window.hasTouched &&
              this.setState({
                hovered: null,
              })
            }
            hovered={this.state.hovered === party}
          />
        ))}
      </div>
    );
  }

  renderSeats({ parties }) {
    return parties.reduce(
      (seats, party) =>
        seats.concat(
          times(party.seats, (i) => (
            <Seat
              onToggle={() => this.toggleParty(party)}
              onMouseEnter={() =>
                !window.hasTouched &&
                this.setState({
                  hovered: party,
                })
              }
              onMouseLeave={() =>
                !window.hasTouched &&
                this.state.hovered &&
                this.state.hovered === party &&
                this.setState({
                  hovered: null,
                })
              }
              hovered={this.state.hovered === party}
              key={party.name + "-" + i}
              backgroundColor={party.color}
            />
          ))
        ),
      []
    );
  }

  render() {
    const active = parties.filter(
      (party) =>
        this.state.active.includes(party) || party === this.state.hovered
    );
    const inactiveParties = parties.filter(
      (party) => !this.state.active.includes(party)
    );
    const activeSum = active.reduce((seats, party) => seats + party.seats, 0);
    return (
      <div className="App">
        <div className="Header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 510">
            <g fill="#414042">
              <path
                className="st0"
                d="M377.568 182.416c-13-14.2-41-5.2-41 16.4 0 19.2 26 31.4 41 16.6l11.2 20c-8 5.4-17.8 8.8-28.4 8.8-26.4 0-47.8-20.4-47.8-45.8 0-25.2 21.4-45.6 47.8-45.6 10.8 0 20.6 3.4 28.8 9.2l-11.6 20.4zm107.2 16.2c0 25.4-21.2 45.6-47.8 45.6-26.4 0-47.6-20.2-47.6-45.6 0-25.2 21.2-45.6 47.6-45.6 26.6 0 47.8 20.4 47.8 45.6zm-25.2-.2c0-6.2-2.2-12-6.4-16.4-4.4-4.6-9.8-7-16-7-5.8 0-11.6 2.4-15.6 7-4.6 4.4-6.8 10.4-6.8 16.6 0 6.4 2.2 12.2 6.8 16.8 4 4.4 9.8 6.8 15.6 6.8 6.2 0 11.6-2.4 16-6.8 4.2-4.6 6.4-10.6 6.4-17zm129.7-42.8v86.2h-21.2v-8.4c-8 6.8-18.4 10.8-29.6 10.8-25.4 0-45.8-20.4-45.8-45.6 0-25.4 20.4-45.6 45.8-45.6 11.2 0 21.6 4 29.6 10.8l2-8.2h19.2zm-25.2 43c0-6.2-2.2-12.2-6.6-16.6-4.2-4.4-9.8-6.8-15.8-6.8s-11.6 2.4-16 6.8c-4.2 4.4-6.6 10.4-6.6 16.6 0 6.2 2.4 12 6.6 16.6 4.4 4.4 10 6.8 16 6.8s11.6-2.4 15.8-6.8c4.4-4.6 6.6-10.4 6.6-16.6zm41.7 43.2v-118.4h25.6v118.4h-25.6zm41.8-92.2v-26h25.8v26h-25.8zm0 92.2v-86.2h25.8v86.2h-25.8zm101.7-86.2v23.4h-20v62.8h-25.4v-62.8h-18v-23.4h18v-32h25.4v32h20zm131.5 72.6c-8.2 9.8-20.8 16-34.6 16-25.2 0-45.8-20.6-45.8-45.8 0-25.4 20.6-45.8 45.8-45.8 25.2 0 45.8 20.4 45.8 45.8 0 2.8-.2 5.4-.8 8.2h-64.4c1.2 3.2 2.8 6 5 8.4 4.2 4.6 9.6 7 15.4 7 5.4 0 10.8-2.4 14.8-6.4l18.8 12.6zm-13-36.8c-1-3.6-2.8-7-5.4-9.8-4-4.4-9.6-6.8-15.2-6.8-5.8 0-11.2 2.4-15.4 6.8-2.4 2.8-4.2 6.2-5.4 9.8h41.4zm-528.4 113c6.2-5.4 12.2-9.2 19.8-9.2 12.4 0 21.2 6.6 28.4 17 7-10.4 16.2-17 28.4-17 21.4 0 36.8 20.4 36.8 45.8v42.8h-22.4v-42.8c0-12.4-5.8-23.4-17.2-23.4-11.2 0-16.6 11.2-17 22v44.2h-22.4v-42.8c0-12.4-6-23.4-17.2-23.4-9.8 0-14 7.6-16.4 16.6v49.6h-24v-86.2h19.4l3.8 6.8zm219.4-6.8v86.2h-21.2v-8.4c-8 6.8-18.4 10.8-29.6 10.8-25.4 0-45.8-20.4-45.8-45.6 0-25.4 20.4-45.6 45.8-45.6 11.2 0 21.6 4 29.6 10.8l2-8.2h19.2zm-25.2 43c0-6.2-2.2-12.2-6.6-16.6-4.2-4.4-9.8-6.8-15.8-6.8s-11.6 2.4-16 6.8c-4.2 4.4-6.6 10.4-6.6 16.6 0 6.2 2.4 12 6.6 16.6 4.4 4.4 10 6.8 16 6.8s11.6-2.4 15.8-6.8c4.4-4.6 6.6-10.4 6.6-16.6zm98.3 43.2l-22.8-35-5.8 6v29h-28v-117.8h28v59.4l21.6-27.8h34.2l-31 36 36.6 50.2h-32.8z"
              />
              <path
                className="st0"
                d="M742.168 370.216c-8.2 9.8-20.8 16-34.6 16-25.2 0-45.8-20.6-45.8-45.8 0-25.4 20.6-45.8 45.8-45.8 25.2 0 45.8 20.4 45.8 45.8 0 2.8-.2 5.4-.8 8.2h-64.4c1.2 3.2 2.8 6 5 8.4 4.2 4.6 9.6 7 15.4 7 5.4 0 10.8-2.4 14.8-6.4l18.8 12.6zm-13-36.8c-1-3.6-2.8-7-5.4-9.8-4-4.4-9.6-6.8-15.2-6.8-5.8 0-11.2 2.4-15.4 6.8-2.4 2.8-4.2 6.2-5.4 9.8h41.4zm55.7-26c6.4-8.4 17.8-12 29.2-12 5 0 10 .8 14.6 2.4l-9.8 22.2c-14.6-6.4-29.4 2.4-32 16.2v47.6h-25v-86.2h19.4l3.6 9.8z"
              />
            </g>
            <path
              className="st1"
              d="M171.224 228.87c2.52-3.23 5.49-6.072 8.784-8.527l-59.29-102.95c-21.12 13.176-39.074 31.002-52.444 51.992l102.95 59.484z"
              fill="#ff7600"
            />
            <path
              className="st2"
              d="M190.34 214.53c3.554-1.42 7.364-2.454 11.304-2.97V92.722c-25.447.904-49.408 7.62-70.657 18.794L190.34 214.53z"
              fill="#2e89b5"
            />
            <path
              className="st3"
              d="M170.837 285.446L67.887 344.8c13.24 21.12 31.13 39.01 52.25 52.25l59.42-102.885c-3.295-2.52-6.202-5.425-8.72-8.72z"
              fill="#a7e5c0"
            />
            <path
              className="st4"
              d="M164.895 275.177c-1.55-3.746-2.648-7.686-3.165-11.82H42.892c.904 25.64 7.686 49.796 19.053 71.174l102.95-59.35z"
              fill="#e2001a"
            />
            <path
              className="st5"
              d="M161.73 251.474c.58-4.328 1.744-8.526 3.423-12.4l-102.82-59.42c-11.626 21.572-18.537 45.92-19.44 71.82H161.73z"
              fill="#82bb00"
            />
            <path
              className="st6"
              d="M201.644 303.27c-4.134-.515-8.138-1.613-11.884-3.163l-59.42 102.885c21.38 11.367 45.6 18.213 71.304 19.117V303.27z"
              fill="#26a2ec"
            />
            <g className="st7">
              <path
                className="st8"
                d="M351.2 1088.2c-1.8-11.5-10.4-19.9-24.4-19.9-16.4 0-27.1 13.8-27.1 35.8 0 22.7 10.8 36 27.2 36 13.3 0 22.1-6.9 24.4-19.3h23.5c-2.1 23.9-20.8 39.6-48 39.6-31.7 0-52.2-21.4-52.2-56.2 0-34.2 20.5-56 52-56 28.6 0 46.4 17.7 48.1 40.2h-23.5zm35.3 15.9c0-34.5 20.6-56 52.5-56 32.2 0 52.6 21.5 52.6 56 0 34.9-20.3 56.2-52.6 56.2-32.1 0-52.5-21.4-52.5-56.2zm79.9.1c0-22.9-10.3-36.3-27.4-36.3-17 0-27.3 13.5-27.3 36.3 0 22.9 10.3 36.3 27.3 36.3 17.2-.1 27.4-13.5 27.4-36.3zm37.2 23.2c0-19.5 14.9-30.6 42.3-32.3l28.4-1.7v-8c0-11.6-7.8-17.9-21.2-17.9-11.3 0-19.4 5.9-21.1 14.7h-23c.6-20 19.2-34.3 44.8-34.3 27.3 0 44.9 14.2 44.9 35.9v74.8H575V1141h-.6c-6 11.7-19.5 18.8-34 18.8-21.4.1-36.8-13-36.8-32.4zm70.7-9.3v-8.3l-25 1.6c-13.6.9-20.8 6.1-20.8 15 0 8.8 7.6 14.4 19.2 14.4 15.2 0 26.6-9.4 26.6-22.7zm47.6-110.2h24.9v150.8h-24.9v-150.8zm47 14.1c0-7.8 6.3-13.7 14-13.7 7.8 0 14 5.9 14 13.7 0 7.7-6.2 13.7-14 13.7-7.8-.1-14-6.1-14-13.7zm1.6 27.5h24.9v109.2h-24.9v-109.2zm78.2-24.4v24.4h20.7v19.3h-20.7v57.5c0 9 4.2 13.3 13.2 13.3 2.4 0 5.8-.3 7.4-.5v19.1c-2.7.6-7.8 1-13.1 1-23.2 0-32.4-8.4-32.4-29.5v-60.9H709v-19.3h14.9v-24.4h24.8z"
              />
              <path
                className="st9 st10"
                d="M798.3 1010.3h.8c6.3.4 11.3 5.7 11.2 11.9-.1 6.4-5.4 11.5-12 11.5h-.6c-6.4-.3-11.5-5.7-11.3-12 .1-6.5 5.4-11.4 11.9-11.4m0-2c-7.6 0-13.8 5.7-14 13.3-.2 7.4 5.8 13.7 13.2 14.1h.7c7.7 0 13.8-5.9 14-13.4.1-7.3-5.8-13.5-13-13.9-.3-.1-.6-.1-.9-.1z"
              />
              <path
                className="st8"
                d="M929 1126.2c-3.2 20.2-22.6 34.1-48 34.1-32.3 0-52.2-21.4-52.2-55.7 0-34.4 20.1-56.5 51.3-56.5 30.6 0 49.9 20.9 49.9 53.9v8.2h-76.4v1.5c0 17.6 11.2 29.3 27.9 29.3 12 0 21.3-5.7 24.2-14.7H929zm-75.2-32.6h51.7c-.5-15.8-10.7-26.2-25.5-26.2-14.5 0-25.1 10.6-26.2 26.2zm-574.7 125H303v19.2h.5c4.8-12.7 16.7-20.5 31.1-20.5 15.4 0 26.5 7.8 30.6 21.7h.5c5.3-13.4 18.4-21.7 34.1-21.7 21.5 0 35.7 14.4 35.7 36.2v74.3h-24.9v-68.2c0-13.6-7.2-21.3-20-21.3-12.5 0-21.2 9.3-21.2 22.6v66.9h-24.2v-69.6c0-12.3-7.6-19.9-19.7-19.9-12.6 0-21.5 9.7-21.5 23.2v66.3h-24.9v-109.2zm172.8 77.9c0-19.5 14.9-30.6 42.3-32.3l28.4-1.7v-8c0-11.6-7.8-17.9-21.2-17.9-11.3 0-19.4 5.9-21.1 14.7h-23c.6-20 19.2-34.3 44.8-34.3 27.3 0 44.9 14.2 44.9 35.9v74.8h-23.9v-17.6h-.6c-6 11.7-19.5 18.8-34 18.8-21.2.1-36.6-13-36.6-32.4zm70.7-9.3v-8.3l-25 1.6c-13.6.9-20.8 6.1-20.8 15 0 8.8 7.6 14.4 19.2 14.4 15.1 0 26.6-9.4 26.6-22.7zm114.5-68.6H666l-44.1 47 45.9 62.1H639l-35.2-47-8.8 8.9v38.2h-24.9V1177H595v87.5h.3l41.8-45.9zm131.5 76.7c-3.2 20.2-22.6 34.1-48 34.1-32.3 0-52.2-21.4-52.2-55.7 0-34.4 20.1-56.5 51.3-56.5 30.6 0 49.9 20.9 49.9 53.9v8.2h-76.4v1.5c0 17.6 11.2 29.3 27.9 29.3 12 0 21.3-5.7 24.2-14.7h23.3zm-75.3-32.6H745c-.5-15.8-10.7-26.2-25.5-26.2-14.5 0-25.1 10.6-26.2 26.2zm94.7-44.1h23.9v19h.5c3.5-12.8 13.3-20.2 26.2-20.2 3.3 0 6.1.4 8 1v22.6c-2.1-.8-6-1.4-10.3-1.4-14.6 0-23.4 9.5-23.4 24.9v63.3H788v-109.2z"
              />
            </g>
            <path className="st11" d="M810.8 1062.3v97.4h-24.9v-97.4" />
            <path
              className="st7 st9 st12"
              d="M792.7 1011.7c-2.6 4.5-5 9-4.9 14.4 0 1.3 1.7 2 2.6 1.1 3.4-3.7 6.7-7.6 9.9-11.6l-2.4-.3c1.1 1.8-1 6.5-1.5 8.4-.7 2.5-1.4 5.1-2.1 7.6-.4 1.3 1.1 2.2 2.2 1.7 5.6-2.6 10.3-8.6 14.7-12.8 1.4-1.3-.7-3.4-2.1-2.1-4.2 4-8.8 9.8-14.1 12.3.7.6 1.5 1.1 2.2 1.7 1.1-4.1 2.2-8.1 3.3-12.2.6-2.2 1.2-4.1 0-6.1-.5-.7-1.7-1.1-2.4-.3-3.1 4-6.4 7.8-9.9 11.6.9.4 1.7.7 2.6 1.1-.1-4.8 2.1-8.8 4.5-12.9 1-1.7-1.6-3.2-2.6-1.6z"
            />
            <path
              className="st0"
              d="M761.568 149.616v-26h25.8v26h-25.8zm0 92.2v-86.2h25.8v86.2h-25.8z"
              fill="#414042"
            />
          </svg>
          <p>
            Coalitiemaker maakt de mogelijke coalities in de Tweede Kamer
            inzichtelijk.
            <br />
            Op dit moment op basis van het gemiddelde uit de slotpeilingen van:
          </p>
          <ul>
            <li>
              <a
                href="https://eenvandaag.avrotros.nl/opiniepanel/uitslagen/d66-stijgt-8-zetels-in-laatste-zetelpeiling-voor-verkiezingen-pvv-daalt-5-zetels-161768"
                target="_blank"
              >
                EenVandaag (28-10-2025)
              </a>
            </li>
            <li>
              <a
                href="https://www.ipsos-publiek.nl/actueel/ipsos-io-zetelpeiling-vijf-partijen-dicht-bij-elkaar/"
                target="_blank"
              >
                Ipsos I&amp;O (28-10-2025)
              </a>
            </li>
            <li>
              <a
                href="https://maurice.nl/2025/10/28/slotpeiling-en-prognose-tk205/"
                target="_blank"
              >
                Peil.nl (28-10-2025)
              </a>
            </li>
          </ul>
          <p>
            <small>
              Door marges in de peilingen en afronding van de gemiddelden zijn
              de cijfers niet exact.
            </small>
          </p>
          <p>
            Zodra de exit-polls van Ipsos in opdracht van NOS en RTL bekend zijn
            (naar verwachting rond 21:00 vanavond), zal de data hieronder worden
            bijgewerkt. Hetzelfde geldt wanneer de volledige uitslagen van de
            verkiezingen beschikbaar zijn.
          </p>
        </div>
        <div className="seats">
          <div className="seats-group seats-group-inactive">
            {this.renderSeats({ parties: inactiveParties })}
            {times(
              activeSum -
                (this.state.hovered &&
                !this.state.active.includes(this.state.hovered)
                  ? this.state.hovered.seats
                  : 0),
              (i) => (
                <Seat
                  key={"required-" + i}
                  backgroundColor="#eee"
                  disabled={true}
                />
              )
            )}
          </div>
          <div className="seats-group seats-group-active">
            {this.renderSeats({ parties: active })}
            {times(75 - activeSum, (i) => (
              <Seat
                key={"required-" + (75 - activeSum - i)}
                backgroundColor="#eee"
                disabled={true}
              />
            ))}
          </div>
        </div>
        <div className="parties">
          <div className="party-group party-group-inactive">
            {this.renderPartyList({
              parties: inactiveParties,
              isActive: false,
            })}
          </div>
          <div className="party-group party-group-active">
            {active.length ? (
              <div>
                {this.renderPartyList({
                  parties: active,
                  isActive: true,
                })}
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
            ) : (
              <span className="party-group-empty">
                geen partijen geselecteerd
              </span>
            )}
          </div>
        </div>
        <Finder
          onClick={(parties) => this.handleClickFinder(parties)}
          parties={parties}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
