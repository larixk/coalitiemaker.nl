# Coalitiemaker.nl

Coalitiemaker.nl is an interactive tool for visualizing possible coalitions in the Dutch Tweede Kamer (House of Representatives). Users can explore which combinations of political parties could form a majority, based on recent election results, exit polls, or polling data.

The application allows users to try combinations themselves or can automatically generate an overview of available majority coalitions based on a set of user-determined criteria.

Originally created for the 2017 Dutch general election, the project continues to be updated with new data at irregular intervals.

## Goals and Approach

- **Goal:** Make coalition-building in Dutch politics transparent and accessible by allowing users to select parties and instantly see the combined seat count.
- **Approach:**
  - Built with React (using Create React App, started in 2017).
  - The state of selected parties is managed in the UI, and the URL hash updates for easy sharing of specific coalitions.
  - Party data (seats, colors, etc.) is maintained in [`src/parties.js`](src/parties.js).

## Data

The party and seat data is based on the latest available election results or polling from sources such as EenVandaag, Ipsos I&O, and Peil.nl.  
You can find and update this data in [`src/parties.js`](src/parties.js).

## Contributing

Contributions are very welcome!  
If you have ideas for improvements, bug fixes, or updated data, please open a pull request. We appreciate any help in making the tool more useful and accurate.

## Available Scripts

In the project directory, you can run:

- `npm start` — Runs the app in development mode.
- `npm test` — Launches the test runner.
- `npm run build` — Builds the app for production.
- `npm run eject` — Ejects from Create React App (one-way operation).

For more details, see the [Create React App documentation](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
