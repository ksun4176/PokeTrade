# PokéTrade
The back end server to manage trade requests/offers.

## Table of Contents
- [Endpoints](#endpoints)
- [FAQs](#faqs)
- [File Structure](#file-structure)
- [Contributing](#contributing)

## Endpoints
All APIs start with /api
### `/login`
**GET**: Log in using Discord

### `/redirect`
**GET**: Redirect to the web app

### `/status`
**GET**: Get the authenticated user

### `/logout`
**GET**: Remove access from API

### `/pokemons`
**GET**: Get all available Pokémons

### `/users/@me/accounts`
**GET**: Get all accounts linked to the login user

**POST**: Link a new account to the login user
Body:
- inGameName: The name of the account
- friendCode: The friend code to add the account

### `/accounts/:accountId`
Params:
- accountId: In Game Account

**PUT**: Update the account properties
Body:
- inGameName: The name of the account
- friendCode: The friend code to add the account

### `/accounts/:accountId/trades`
Params: 
- accountId: In Game Account

**GET**: Get all trades linked to an account

**POST**: Update all the trades linked to an account. Any trades not included in this list will be removed.
Body:
- trades: array of trades to link to account
   - tradeType: Whether a trade is Request/Offer
   - pokemon: Which Pokémon to trade

### `/trades`
**GET**: Get all trades in the system

## FAQs


## File Structure
- `Files in root directory`: These files are used to configure Nextjs
- `src/`: This is where your server code would live
   - `./main.ts`: Entrypoint of your server
   - `./app.module.ts`: your base level module
   - `./utils/*`: TypeScript types, functions, classes, etc. used throughout the project
   - `./{dirName}/`: different modules that take care of individual aspects of the server
- `prisma/`: This is where your database schema and migrations live
- `test/`: This is where your unit tests live

- All other files are auto generated so they do not need to be touched.

## Contributing
This server is built in Nextjs.
The languages we are using are TypeScript.

To run app in development mode:
1. Run script `npm run start:dev`.
2. You should now be able to access REST API endpoints.

To run tests:
1. Run script `npm run test:watch`.
2. This will launch the test runner in the interactive watch mode.

To build the app for production:
1. Run script `npm run build`.
2. App will be built in the `dist` folder.
It correctly bundles app in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
3. Run script `npm run start:prod` to make sure it will still run after being optimized