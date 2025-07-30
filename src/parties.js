const polls = {
  eenVandaag: {
    PVV: 30,
    "PvdA/GL": 29,
    CDA: 23,
    VVD: 23,
    D66: 10,
    JA21: 7,
    SP: 7,
    FvD: 4,
    PvdD: 4,
    CU: 3,
    SGP: 3,
    BBB: 2,
    DENK: 2,
    Volt: 2,
    NSC: 1,
  },
  ipsos: {
    PVV: 27,
    CDA: 24,
    "PvdA/GL": 24,
    VVD: 20,
    D66: 12,
    JA21: 7,
    PvdD: 6,
    SP: 6,
    BBB: 4,
    CU: 4,
    DENK: 4,
    SGP: 4,
    Volt: 4,
    FvD: 3,
    NSC: 1,
  },
  peil: {
    PVV: 29,
    "PvdA/GL": 27,
    CDA: 21,
    VVD: 19,
    D66: 10,
    JA21: 8,
    SP: 8,
    BBB: 5,
    PvdD: 5,
    DENK: 4,
    FvD: 4,
    SGP: 4,
    CU: 3,
    Volt: 3,
    NSC: 0,
  },
};

const parties = [
  {
    name: "PVV",
    eerste: 4,
    color: "#2e89b5",
  },
  {
    name: "PvdA/GL",
    eerste: 14,
    color: "#e2001a",
  },
  {
    name: "VVD",
    eerste: 10,
    color: "#ff7600",
  },
  {
    name: "NSC",
    eerste: 0,
    color: "#13123b",
  },
  {
    name: "D66",
    eerste: 5,
    color: "#a7e5c0",
  },
  {
    name: "BBB",
    eerste: 16,
    color: "#94c224",
  },
  {
    name: "SP",
    eerste: 3,
    color: "#fe2b24",
  },
  {
    name: "CDA",
    eerste: 6,
    color: "#6ab651",
  },
  {
    name: "DENK",
    eerste: 0,
    color: "#39afb6",
  },
  {
    name: "FvD",
    eerste: 2,
    color: "#651817",
  },
  {
    name: "SGP",
    eerste: 2,
    color: "#f37022",
  },
  {
    name: "PvdD",
    eerste: 3,
    color: "#006b2d",
  },
  {
    name: "CU",
    eerste: 3,
    color: "#26a2ec",
  },
  {
    name: "Volt",
    eerste: 2,
    color: "#4e2277",
  },
  {
    name: "JA21",
    eerste: 3,
    color: "#242B57",
  },
];

// Calculate the averages, rounding to whole seats using the largest remainder method
let totalFractionalSeats = 0;

parties.forEach((p) => {
  p.fractionalSeats =
    (polls.eenVandaag[p.name] + polls.ipsos[p.name] + polls.peil[p.name]) / 3;
  p.seats = Math.floor(p.fractionalSeats);
  totalFractionalSeats += p.seats;
});

const remainingSeats = 150 - totalFractionalSeats;
parties.sort((a, b) => (b.fractionalSeats % 1) - (a.fractionalSeats % 1));
for (let i = 0; i < remainingSeats; i++) {
  parties[i].seats++;
}

if (parties.reduce((a, b) => a + b.seats, 0) !== 150) {
  throw new Error("Total seats is not 150");
}

const sortedParties = parties
  .sort((a, b) => a.name.localeCompare(b.name))
  .sort((a, b) => b.seats - a.seats);

export default sortedParties;
