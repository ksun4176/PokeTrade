# PokéTrade
The back end server to manage trade requests/offers.

## Table of Contents
- [Endpoints](#endpoints)
- [FAQs](#faqs)
- [File Structure](#file-structure)
- [Contributing](#contributing)

## Endpoints
All APIs start with /api
### `/auth/login`
**GET**: Log in using Discord

### `/auth/redirect`
**GET**: Redirect to the web app

### `/auth/status`
**GET**: Get the authenticated user

### `/auth/logout`
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
- accountId: ID of account

**PUT**: Update the account properties
Body:
- inGameName: The name of the account
- friendCode: The friend code to add the account

### `/accounts/:accountId/trades`
Params: 
- accountId: ID of account

**GET**: Get all trades linked to an account

**POST**: Update all the trades linked to an account. Any trades not included in this list will be removed.
Body:
- trades: array of trades to link to account
   - tradeType: Whether a trade is Request/Offer
   - pokemon: Which Pokémon to trade

### `/accounts/:accountId/tradematches`
Params:
- accountId: ID of account

**GET**: Get information relevant to trades that match the account's wishlist/list for trading.
Response:
{
   cardToAccount: Map of cards in account's wishlist TO other accounts that have offered said card. These accounts are further broken into 2 buckets.
   - matchingTrades: Trades with the accounts that the requester DID offer a pokemon that can be traded
   - otherTrades: Trades with the accounts that the requester DID NOT offer a pokemon that can be traded
   accountToPokemon: Map of accounts that have offered a requested card TO all cards that those accounts have requested. These cards are further broken into 2 buckets.
   - matchingTrades: ID of cards that the requester DID offer
   - otherTrades: ID of cards that the requester DID NOT offer
}
```
{
  "cardToAccount": [
    [736, {
        "matchingTrades": [
          {
            "id": 316,
            "pokemonId": 736,
            "accountId": 66,
            "tradeTypeId": 2,
            "updated": "2025-02-16T18:02:57.000Z",
            "account": {
              "id": 66,
              "inGameName": "User 1",
              "friendCode": "123456789012341",
              "userId": 72,
              "user": {
                "discordId": "1",
                "username": "User 1"
              }
            }
          }
        ],
        "otherTrades": [
          {
            "id": 334,
            "pokemonId": 736,
            "accountId": 69,
            "tradeTypeId": 2,
            "updated": "2025-02-16T18:02:57.000Z",
            "account": {
              "id": 69,
              "inGameName": "User 4",
              "friendCode": "123456789012344",
              "userId": 75,
              "user": {
                "discordId": "4",
                "username": "User 4"
              }
            }
          }
        ]
      }
    ]
  ]
  "accountToPokemon": [
    [66, {
        "matchingTrades": [121, 173],
        "otherTrades": [28, 409]
      }
    ],
    [69, {
        "matchingTrades": [143],
        "otherTrades": [409]
      }
    ]
  ]
}
```

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
- `prisma/`: This is where your database schema, migrations, seeds live
- `test/`: This is where your unit tests live

- All other files are auto generated so they do not need to be touched.

## Contributing
This server is built in Nextjs.
The languages we are using are TypeScript.

To make updates to database schema:
1. Make changes to `/prisma/schema.prisma/`
2. Run script `npx prisma migrate dev --name {name_your_update}`
3. Verify that the generated migration.sql has the changes you expect
4. If you need to populate a testing database with new data, verify that the data set in `/prisma/seed/seed.ts` meet your needs. If not, make updates
5. Run script `npx prisma db seed` to populate with test data.

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