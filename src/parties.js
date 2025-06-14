const parties = [
  {
    name: "PVV",
    seats: 30,
    eerste: 4,
    color: "#2e89b5",
  },
  {
    name: "PvdA/GL",
    seats: 28,
    eerste: 14,
    color: "#e2001a",
  },
  {
    name: "VVD",
    seats: 26,
    eerste: 10,
    color: "#ff7600",
  },
  {
    name: "NSC",
    seats: 2,
    eerste: 0,
    color: "#13123b",
  },
  {
    name: "D66",
    seats: 10,
    eerste: 5,
    color: "#a7e5c0",
  },
  {
    name: "BBB",
    seats: 3,
    eerste: 16,
    color: "#94c224",
  },
  {
    name: "SP",
    seats: 7,
    eerste: 3,
    color: "#fe2b24",
  },
  {
    name: "CDA",
    seats: 18,
    eerste: 6,
    color: "#6ab651",
  },
  {
    name: "DENK",
    seats: 3,
    eerste: 0,
    color: "#39afb6",
  },
  {
    name: "FvD",
    seats: 4,
    eerste: 2,
    color: "#651817",
  },
  {
    name: "SGP",
    seats: 3,
    eerste: 2,
    color: "#f37022",
  },
  {
    name: "PvdD",
    seats: 6,
    eerste: 3,
    color: "#006b2d",
  },
  {
    name: "CU",
    seats: 3,
    eerste: 3,
    color: "#26a2ec",
  },
  {
    name: "Volt",
    seats: 3,
    eerste: 2,
    color: "#4e2277",
  },
  {
    name: "JA21",
    seats: 4,
    eerste: 3,
    color: "#242B57",
  },
];

const sortedParties = parties
  .sort((a, b) => a.name.localeCompare(b.name))
  .sort((a, b) => b.seats - a.seats);

export default sortedParties;
