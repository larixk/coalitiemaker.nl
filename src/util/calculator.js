import leftPad from "left-pad";

import times from "./times";

const doesNotContainInvalidParties = coalition =>
  coalition.parties.every(party => !party.invalid);

const cantBeSmaller = coalition =>
  coalition.parties.every(party => coalition.seats - party.seats < 75) ||
  coalition.parties.every(party => coalition.eerste - party.eerste < 38);

const hasMajorityWith = (category, majority, coalition) =>
  coalition[category] >= majority;

const isValidCoalition = coalition =>
  doesNotContainInvalidParties(coalition) &&
  hasMajorityWith("seats", 75, coalition) &&
  hasMajorityWith("eerste", 38, coalition) &&
  cantBeSmaller(coalition) &&
  true;

// const compare = (a, b) =>
//   a.parties.length * 1000 + a.seats - (b.parties.length * 1000 + b.seats);

const compare = (a, b) =>
  b.eerste +
  1000 * (b.seats / b.parties.length) -
  (a.eerste + 1000 * (a.seats / a.parties.length));

export default parties => times(Math.pow(2, parties.length), i => ({
  hash: leftPad(i.toString(2), parties.length, 0),
  parties: leftPad(i.toString(2), parties.length, 0)
    .split("")
    .map((b, j) => b === "0" ? null : parties[j])
    .filter(a => a)
}))
  .map(coalition => ({
    ...coalition,
    seats: coalition.parties.reduce((seats, party) => seats + party.seats, 0),
    eerste: coalition.parties.reduce((seats, party) => seats + party.eerste, 0)
  }))
  .filter(isValidCoalition)
  .sort(compare);
