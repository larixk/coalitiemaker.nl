# Poll Data Importer

Automatische importer voor peilingsdata van Wikipedia naar de Coalitiemaker app.

## Hoe het werkt

Dit script haalt automatisch de laatste peilingsdata op van Wikipedia en werkt `src/parties.js` bij met de meest recente cijfers van:
- EenVandaag
- Ipsos I&O
- Peil.nl

De data wordt opgehaald van: https://nl.wikipedia.org/wiki/Tweede_Kamerverkiezingen_2025/Peilingen

## Handmatig gebruiken

### Installatie

```bash
cd tools/importer
npm install
```

### Data importeren

```bash
npm run import
```

Dit zal:
1. De Wikipedia pagina ophalen
2. De laatste peilingen parsen
3. `src/parties.js` bijwerken met de nieuwe data

## Automatische updates via GitHub Actions

De peilingsdata wordt automatisch bijgewerkt via een GitHub Action die draait op een configureerbaar schema.

### Frequentie aanpassen

Bewerk `.github/workflows/update-polls.yml` om de frequentie aan te passen:

**Hoog seizoen** (4x per dag om 6:00, 12:00, 18:00, 00:00 UTC):
```yaml
schedule:
  - cron: '0 6,12,18,0 * * *'
```

**Laag seizoen** (1x per week op maandag om 6:00 UTC):
```yaml
schedule:
  - cron: '0 6 * * 1'
```

**Andere voorbeelden:**
- Dagelijks om 9:00 UTC: `'0 9 * * *'`
- Elke 12 uur: `'0 */12 * * *'`
- Elke 6 uur: `'0 */6 * * *'`

### Handmatig triggeren

Je kunt de GitHub Action ook handmatig triggeren:
1. Ga naar de "Actions" tab in GitHub
2. Selecteer "Update Poll Data"
3. Klik op "Run workflow"

## Hoe de scraper werkt

1. **Data ophalen**: Download de Wikipedia pagina met peilingsdata
2. **Tabel parsen**: Zoek en parse de tabel met zetelverdeling
3. **Data extractie**: Haal de meest recente peilingen op voor elk bureau
4. **Validatie**: Check of elk peiling 150 zetels heeft
5. **Update**: Werk `src/parties.js` bij met de nieuwe data

## Troubleshooting

### "Kon geen data vinden voor..."

De Wikipedia tabel structuur is mogelijk veranderd. Check of:
- De partijnamen in `PARTY_NAME_MAPPING` nog kloppen
- De peiler namen in `POLL_SOURCES` nog correct zijn
- De tabel nog de class `wikitable` heeft

### "Total seats is not 150"

Er is een fout in de data extractie. Mogelijk:
- Wikipedia tabel is incomplete
- Partijen zijn hernoemd
- Extra kolommen zijn toegevoegd aan de tabel

## Dependencies

- `axios`: Voor het ophalen van de Wikipedia pagina
- `cheerio`: Voor het parsen van de HTML tabel
