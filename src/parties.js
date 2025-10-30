const parties = [
  {
    name: "PVV",
    eerste: 4,
    seats: 26,
    color: "#2e89b5",
  },
  {
    name: "D66",
    eerste: 5,
    seats: 26,
    color: "#a7e5c0",
  },
  {
    name: "VVD",
    eerste: 10,
    seats: 22,
    color: "#ff7600",
  },
  {
    name: "GL-PvdA",
    eerste: 14,
    seats: 20,
    color: "#e2001a",
  },
  {
    name: "CDA",
    eerste: 6,
    seats: 18,
    color: "#6ab651",
  },
  {
    name: "JA21",
    eerste: 3,
    seats: 9,
    color: "#242B57",
  },
  {
    name: "FvD",
    eerste: 2,
    seats: 7,
    color: "#651817",
  },
  {
    name: "BBB",
    eerste: 16,
    seats: 4,
    color: "#94c224",
  },
  {
    name: "DENK",
    eerste: 0,
    seats: 3,
    color: "#39afb6",
  },
  {
    name: "SP",
    eerste: 3,
    seats: 3,
    color: "#fe2b24",
  },
  {
    name: "SGP",
    eerste: 2,
    seats: 3,
    color: "#f37022",
  },
  {
    name: "PvdD",
    eerste: 3,
    seats: 3,
    color: "#006b2d",
  },
  {
    name: "CU",
    eerste: 3,
    seats: 3,
    color: "#26a2ec",
  },
  {
    name: "50plus",
    eerste: 1,
    seats: 2,
    color: "#500051",
  },
  {
    name: "Volt",
    eerste: 2,
    seats: 1,
    color: "#4e2277",
  },
  {
    name: "NSC",
    eerste: 0,
    seats: 0,
    color: "#13123b",
  },
];

if (parties.reduce((a, b) => a + b.seats, 0) !== 150) {
  throw new Error("Total seats is not 150 for parties after rounding");
}

const sortedParties = parties
  .sort((a, b) => a.name.localeCompare(b.name))
  .sort((a, b) => b.seats - a.seats);

export default sortedParties;
