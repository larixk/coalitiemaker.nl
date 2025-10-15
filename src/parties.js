const polls = {
  eenVandaag: {
    PVV: 31,
    "PvdA/GL": 25,
    VVD: 14,
    NSC: 0,
    D66: 14,
    BBB: 4,
    CDA: 23,
    SP: 4,
    DENK: 2,
    PvdD: 3,
    FvD: 5,
    SGP: 3,
    CU: 3,
    Volt: 4,
    JA21: 13,
    "50plus": 2,
  },
  ipsos: {
    PVV: 31,
    CDA: 24,
    "PvdA/GL": 22,
    D66: 14,
    VVD: 13,
    JA21: 13,
    PvdD: 5,
    BBB: 4,
    SP: 4,
    DENK: 4,
    FvD: 4,
    Volt: 4,
    SGP: 4,
    CU: 2,
    NSC: 0,
    "50plus": 2,
  },
  peil: {
    PVV: 31,
    "PvdA/GL": 25,
    CDA: 22,
    VVD: 15,
    D66: 14,
    JA21: 13,
    SP: 4,
    BBB: 4,
    DENK: 4,
    FvD: 5,
    SGP: 3,
    PvdD: 3,
    CU: 3,
    Volt: 3,
    NSC: 0,
    "50plus": 1,
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
  {
    name: "50plus",
    eerste: 1,
    color: "#500051",
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

const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

if (sum(polls.eenVandaag) !== 150) {
  throw new Error("Total seats is not 150 for eenVandaag");
}

if (sum(polls.ipsos) !== 150) {
  throw new Error("Total seats is not 150 for ipsos");
}

if (sum(polls.peil) !== 150) {
  throw new Error("Total seats is not 150 for peil");
}

if (parties.reduce((a, b) => a + b.seats, 0) !== 150) {
  throw new Error("Total seats is not 150 for parties after rounding");
}

const sortedParties = parties
  .sort((a, b) => a.name.localeCompare(b.name))
  .sort((a, b) => b.seats - a.seats);

export default sortedParties;
