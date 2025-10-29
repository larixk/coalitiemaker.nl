import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIKIPEDIA_URL =
  "https://nl.wikipedia.org/wiki/Tweede_Kamerverkiezingen_2025/Peilingen";

// Mapping van Wikipedia partijnamen naar onze code namen
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
  console.log("Ophalen Wikipedia pagina...");
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

  // Zoek de tabel met peilingen
  const table = $("table.wikitable").first();

  if (!table.length) {
    throw new Error("Kon peilingen tabel niet vinden op Wikipedia");
  }

  // Extract partij namen uit de header (eerste rij, vanaf kolom 2)
  const parties = [];
  const headerRow = table.find("tr").first();
  const headerCells = headerRow.find("th, td");

  headerCells.each((i, el) => {
    // Skip eerste twee kolommen (Peilingsorganisatie, Datum)
    // Stop bij "Overig" kolom
    if (i < 2) return;

    const text = $(el).text().trim();

    // Stop bij Overig of Refs
    if (text === "Overig" || text === "Refs") return false;

    const mappedName = PARTY_NAME_MAPPING[text];
    if (mappedName && !parties.includes(mappedName)) {
      parties.push(mappedName);
    }
  });

  console.log(`Gevonden partijen (${parties.length}): ${parties.join(", ")}`);

  if (parties.length === 0) {
    throw new Error("Geen partijen gevonden in tabel header");
  }

  // Parse de data rijen
  table.find("tr").each((i, row) => {
    // Skip header row
    if (i === 0) return;

    const cells = $(row).find("td, th");
    if (cells.length < parties.length + 2) return;

    // Eerste kolom bevat peiler naam
    const peilerCell = $(cells[0]).text().trim();

    // Identificeer welke peiler
    let pollSource = null;
    for (const [wikiName, codeName] of Object.entries(POLL_SOURCES)) {
      if (peilerCell.includes(wikiName)) {
        pollSource = codeName;
        break;
      }
    }

    // Skip als niet een van onze bronnen, of als we deze al hebben
    if (!pollSource || polls[pollSource]) {
      return;
    }

    // Extract datum uit tweede kolom
    const dateCell = $(cells[1]).text().trim();

    // Extract referentie link uit laatste kolom
    const refsCell = $(cells[cells.length - 1]);
    const refLink = refsCell.find('a').first();
    let refUrl = null;

    if (refLink.length) {
      const href = refLink.attr('href');
      if (href && href.startsWith('#')) {
        // Zoek de referentie sectie voor de daadwerkelijke URL
        const refId = href.substring(1);
        const refElement = $(`#${refId}`);
        const externalLink = refElement.find('a.external').first();
        if (externalLink.length) {
          refUrl = externalLink.attr('href');
        }
      }
    }

    // Extract zetels per partij (vanaf kolom 2)
    const pollData = {};
    let totalSeats = 0;

    for (let partyIdx = 0; partyIdx < parties.length; partyIdx++) {
      const cellIdx = partyIdx + 2; // +2 voor peiler en datum kolommen
      const seatText = $(cells[cellIdx]).text().trim();
      const seats = parseInt(seatText);

      if (!isNaN(seats)) {
        const partyName = parties[partyIdx];
        pollData[partyName] = seats;
        totalSeats += seats;
      }
    }

    // Valideer dat we 150 zetels hebben
    if (totalSeats === 150 && Object.keys(pollData).length >= 10) {
      polls[pollSource] = pollData;
      pollMetadata[pollSource] = { date: dateCell, url: refUrl };
      console.log(`✓ ${pollSource}: ${totalSeats} zetels (${dateCell})`);
    } else if (totalSeats > 0) {
      console.log(
        `⚠ ${pollSource}: ${totalSeats} zetels (incorrect, verwacht 150)`
      );
    }
  });

  // Check of we alle drie de peilingen hebben gevonden
  const missingPolls = Object.entries(polls)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingPolls.length > 0) {
    console.warn(
      `Waarschuwing: Kon geen data vinden voor: ${missingPolls.join(", ")}`
    );

    // Als EenVandaag ontbreekt, probeer eerst wat verder te zoeken
    if (missingPolls.includes("eenVandaag")) {
      console.log(
        "Tip: EenVandaag publiceert mogelijk minder frequent. Je kunt overwegen alleen Ipsos en Peil.nl te gebruiken."
      );
    }

    throw new Error(`Incomplete data: ${missingPolls.join(", ")} ontbreken`);
  }

  return { polls, metadata: pollMetadata };
}

function updatePartiesFile(polls, metadata) {
  console.log("\nBijwerken van src/parties.js...");

  const partiesPath = join(__dirname, "..", "..", "src", "parties.js");
  const content = readFileSync(partiesPath, "utf-8");

  // Maak de nieuwe polls object string - alle keys in quotes
  const pollsString = `const polls = ${JSON.stringify(polls, null, 2)};\n`;

  // Maak de metadata object met mooie namen
  const metadataObject = {
    eenVandaag: {
      name: "EenVandaag",
      date: metadata.eenVandaag.date,
      url: metadata.eenVandaag.url || "https://eenvandaag.avrotros.nl/opiniepanel/uitslagen"
    },
    ipsos: {
      name: "Ipsos I&O",
      date: metadata.ipsos.date,
      url: metadata.ipsos.url || "https://www.ipsos-publiek.nl/actueel"
    },
    peil: {
      name: "Peil.nl",
      date: metadata.peil.date,
      url: metadata.peil.url || "https://home.noties.nl/peil/"
    }
  };

  const metadataString = `\nexport const pollMetadata = ${JSON.stringify(metadataObject, null, 2)};\n`;

  // Replace de oude polls definitie
  let updatedContent = content.replace(
    /const polls = \{[\s\S]*?\};\n/,
    pollsString
  );

  // Replace de oude metadata definitie (of voeg toe als die er niet is)
  if (updatedContent.includes('export const pollMetadata')) {
    updatedContent = updatedContent.replace(
      /export const pollMetadata = \{[\s\S]*?\};\n/,
      metadataString
    );
  } else {
    // Voeg metadata toe na de polls definitie
    updatedContent = updatedContent.replace(
      pollsString,
      pollsString + metadataString
    );
  }

  writeFileSync(partiesPath, updatedContent, "utf-8");
  console.log("✓ src/parties.js succesvol bijgewerkt");
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

    console.log("\n✓ Import succesvol afgerond!");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Fout bij importeren:", error.message);
    process.exit(1);
  }
}

main();
