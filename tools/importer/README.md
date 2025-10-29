# Poll Data Importer

Automated importer for Dutch election poll data from Wikipedia to the Coalitiemaker app.

## How it Works

This script automatically fetches the latest polling data from Wikipedia and updates `src/parties.js` with the most recent figures from:

- EenVandaag
- Ipsos I&O
- Peil.nl

Data is sourced from: https://nl.wikipedia.org/wiki/Tweede_Kamerverkiezingen_2025/Peilingen

The importer also extracts poll metadata (dates and URLs) and updates both the poll data and links displayed in the app.

## Usage

### Installation

```bash
cd tools/importer
yarn install
```

### Import Data

```bash
yarn run import
```

This will:

1. Fetch the Wikipedia page
2. Parse the latest polls from all three sources
3. Extract poll dates and reference URLs
4. Update `src/parties.js` with the new data and metadata

## Automated Updates via GitHub Actions

Poll data is automatically updated via a GitHub Action that runs on a configurable schedule.

### Adjusting Frequency

Edit `.github/workflows/update-polls.yml` to change the frequency:

**High season** (2x per day at 12:00 and 18:00 UTC):

```yaml
schedule:
  - cron: "0 12,18 * * *"
```

**Low season** (1x per week on Wednesday at 12:00 UTC):

```yaml
schedule:
  - cron: "0 12 * * 3"
```

## How the Scraper Works

1. **Fetch Data**: Downloads the Wikipedia page containing poll data
2. **Parse Table**: Locates and parses the table with seat distributions
3. **Extract Data**: Retrieves the most recent polls for each polling organization
4. **Extract Metadata**: Gets poll dates and reference URLs from Wikipedia citations
5. **Validation**: Checks that each poll totals exactly 150 seats
6. **Update**: Updates `src/parties.js` with new data and `pollMetadata`

## Output Format

The importer updates `src/parties.js` with:

- **Poll data**: Seat counts per party for each polling organization
- **Poll metadata**: Poll names, dates, and source URLs

```javascript
const polls = {
  "eenVandaag": { "PVV": 29, "GL-PvdA": 25, ... },
  "ipsos": { "PVV": 23, "GL-PvdA": 23, ... },
  "peil": { "PVV": 23, "GL-PvdA": 23, ... }
};

export const pollMetadata = {
  "eenVandaag": {
    "name": "EenVandaag",
    "date": "28 oktober 2025",
    "url": "https://..."
  },
  ...
};
```

## Dependencies

- `axios`: For fetching the Wikipedia page
- `cheerio`: For parsing the HTML table
