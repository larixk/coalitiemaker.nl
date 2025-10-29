import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIKIPEDIA_URL =
  "https://nl.wikipedia.org/wiki/Tweede_Kamerverkiezingen_2025/Peilingen";

const PARTY_NAME_MAPPING = {
  PVV: "PVV",
  "GL-PvdA": "GL-PvdA",
  "GroenLinks-PvdA": "GL-PvdA",
  VVD: "VVD",
  NSC: "NSC",
  D66: "D66",
  BBB: "BBB",
  CDA: "CDA",
  SP: "SP",
  DENK: "DENK",
  PvdD: "PvdD",
  FVD: "FvD",
  FvD: "FvD",
  SGP: "SGP",
  CU: "CU",
  ChristenUnie: "CU",
  Volt: "Volt",
  JA21: "JA21",
  "50­PLUS": "50plus", // Note: bevat soft hyphen
  "50PLUS": "50plus",
  "50Plus": "50plus",
  "50+": "50plus",
};

const POLL_SOURCES = {
  Verian: "eenVandaag",
  "I&O Research": "ipsos",
  "Ipsos I&O": "ipsos",
  Ipsos: "ipsos",
  "Peil.nl": "peil",
};

async function fetchWikipediaPolls() {
  console.log("Fetching Wikipedia page...");
  const response = await axios.get(WIKIPEDIA_URL);
  const $ = cheerio.load(response.data);

  const polls = {
    eenVandaag: null,
    ipsos: null,
    peil: null,
  };

  const pollMetadata = {
    eenVandaag: { date: null, url: null },
    ipsos: { date: null, url: null },
    peil: { date: null, url: null },
  };

  const table = $("table.wikitable").first();

  if (!table.length) {
    throw new Error("Could not find poll table on Wikipedia");
  }

  const parties = [];
  const headerRow = table.find("tr").first();
  const headerCells = headerRow.find("th, td");

  headerCells.each((i, el) => {
    // Skip first two columns (Poll organization, Date)
    // Stop at "Overig" column
    if (i < 2) return;

    const text = $(el).text().trim();

    // Stop at Overig or Refs
    if (text === "Overig" || text === "Refs") return false;

    const mappedName = PARTY_NAME_MAPPING[text];
    if (mappedName && !parties.includes(mappedName)) {
      parties.push(mappedName);
    }
  });

  console.log(`Found parties (${parties.length}): ${parties.join(", ")}`);

  if (parties.length === 0) {
    throw new Error("No parties found in table header");
  }

  // Parse data rows
  table.find("tr").each((i, row) => {
    // Skip header row
    if (i === 0) return;

    const cells = $(row).find("td, th");
    if (cells.length < parties.length + 2) return;

    // First column contains poll name
    const peilerCell = $(cells[0]).text().trim();

    // Identify which poll
    let pollSource = null;
    for (const [wikiName, codeName] of Object.entries(POLL_SOURCES)) {
      if (peilerCell.includes(wikiName)) {
        pollSource = codeName;
        break;
      }
    }

    // Skip if not one of our sources, or if we already have this one
    if (!pollSource || polls[pollSource]) {
      return;
    }

    // Extract date from second column
    const dateCell = $(cells[1]).text().trim();

    // Extract reference link from last column
    const refsCell = $(cells[cells.length - 1]);
    const refLink = refsCell.find("a").first();
    let refUrl = null;

    if (refLink.length) {
      const href = refLink.attr("href");
      if (href && href.startsWith("#")) {
        // Find the reference section for the actual URL
        const refId = href.substring(1);
        const refElement = $(`#${refId}`);
        const externalLink = refElement.find("a.external").first();
        if (externalLink.length) {
          refUrl = externalLink.attr("href");
        }
      }
    }

    // Extract seats per party (from column 2)
    const pollData = {};
    let totalSeats = 0;

    for (let partyIdx = 0; partyIdx < parties.length; partyIdx++) {
      const cellIdx = partyIdx + 2; // +2 for poll and date columns
      const seatText = $(cells[cellIdx]).text().trim();
      const seats = parseInt(seatText);

      if (!isNaN(seats)) {
        const partyName = parties[partyIdx];
        pollData[partyName] = seats;
        totalSeats += seats;
      }
    }

    // Validate that we have 150 seats
    if (totalSeats === 150 && Object.keys(pollData).length >= 10) {
      polls[pollSource] = pollData;
      pollMetadata[pollSource] = { date: dateCell, url: refUrl };
      console.log(`✓ ${pollSource}: ${totalSeats} seats (${dateCell})`);
    } else if (totalSeats > 0) {
      console.log(
        `⚠ ${pollSource}: ${totalSeats} seats (incorrect, expected 150)`
      );
    }
  });

  // Check if we have all three polls
  const missingPolls = Object.entries(polls)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingPolls.length > 0) {
    console.warn(
      `Warning: Could not find data for: ${missingPolls.join(", ")}`
    );

    throw new Error(`Incomplete data: ${missingPolls.join(", ")} ontbreken`);
  }

  return { polls, metadata: pollMetadata };
}

function updatePartiesFile(polls, metadata) {
  console.log("\nUpdating src/parties.js...");

  const partiesPath = join(__dirname, "..", "..", "src", "parties.js");
  const content = readFileSync(partiesPath, "utf-8");

  const pollsString = `const polls = ${JSON.stringify(polls, null, 2)};\n`;

  const metadataObject = {
    eenVandaag: {
      name: "EenVandaag",
      date: metadata.eenVandaag.date,
      url: metadata.eenVandaag.url,
    },
    ipsos: {
      name: "Ipsos I&O",
      date: metadata.ipsos.date,
      url: metadata.ipsos.url,
    },
    peil: {
      name: "Peil.nl",
      date: metadata.peil.date,
      url: metadata.peil.url,
    },
  };

  const metadataString = `export const pollMetadata = ${JSON.stringify(
    metadataObject,
    null,
    2
  )};\n`;

  // Replace the old polls definition
  let updatedContent = content.replace(
    /const polls = \{[\s\S]*?\};\n/,
    pollsString
  );

  // Replace the old metadata definition
  if (updatedContent.includes("export const pollMetadata")) {
    updatedContent = updatedContent.replace(
      /\n+export const pollMetadata = \{[\s\S]*?\};\n/,
      `\n\n${metadataString}`
    );
  } else {
    // Add metadata after the polls definition
    updatedContent = updatedContent.replace(
      pollsString,
      `${pollsString}\n\n${metadataString}`
    );
  }

  writeFileSync(partiesPath, updatedContent, "utf-8");
  console.log("✓ src/parties.js successfully updated");
}

async function main() {
  try {
    console.log("=== Coalitiemaker Poll Importer ===\n");

    const { polls, metadata } = await fetchWikipediaPolls();

    console.log("\nGevonden peilingen:");
    console.log(JSON.stringify(polls, null, 2));

    console.log("\nMetadata:");
    console.log(JSON.stringify(metadata, null, 2));

    updatePartiesFile(polls, metadata);

    console.log("\n✓ Import successfully completed!");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error during import:", error.message);
    process.exit(1);
  }
}

main();
