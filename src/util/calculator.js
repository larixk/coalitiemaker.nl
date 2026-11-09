const doesNotContainInvalidParties = (coalition) =>
  coalition.parties.every((party) => !party.invalid);

const MAJORITY = { seats: 76, eerste: 38 };

const hasMajorityWith = (category, majority, coalition) =>
  coalition[category] >= majority;

// Every party must be needed: without it, a house that the coalition has to
// win (per the selected requirements) would lose its majority.
const cantBeSmaller = (houseRequirements) => (coalition) =>
  coalition.parties.every(
    (party) =>
      (houseRequirements.includes(2) &&
        coalition.seats - party.seats < MAJORITY.seats) ||
      (houseRequirements.includes(1) && coalition.eerste - party.eerste < MAJORITY.eerste)
  );

const isValidCoalition = (houseRequirements) => (coalition) =>
  doesNotContainInvalidParties(coalition) &&
  (!houseRequirements.includes(2) || hasMajorityWith("seats", MAJORITY.seats, coalition)) &&
  (!houseRequirements.includes(1) ||
    hasMajorityWith("eerste", MAJORITY.eerste, coalition)) &&
  cantBeSmaller(houseRequirements)(coalition);

// const compare = (a, b) =>
//   a.parties.length * 1000 + a.seats - (b.parties.length * 1000 + b.seats);

const compare = (a, b) =>
  b.eerste +
  1000 * (b.seats / b.parties.length) -
  (a.eerste + 1000 * (a.seats / a.parties.length));

// Enumerate every combination of at most `limit` parties.
const combinations = (parties, limit) => {
  const result = [];
  const walk = (start, current) => {
    if (current.length > 0) result.push(current);
    if (current.length === limit) return;
    for (let i = start; i < parties.length; i++) {
      walk(i + 1, current.concat(parties[i]));
    }
  };
  walk(0, []);
  return result;
};

export default (houseRequirements, limit = Infinity) => (parties) =>
  combinations(parties, limit)
    .map((combination) => ({
      hash: combination.map((party) => party.name).join("+"),
      parties: combination,
    }))
    .map((coalition) => ({
      ...coalition,
      seats: coalition.parties.reduce((seats, party) => seats + party.seats, 0),
      eerste: coalition.parties.reduce(
        (seats, party) => seats + party.eerste,
        0
      ),
    }))
    .filter(isValidCoalition(houseRequirements))
    .sort(compare);
