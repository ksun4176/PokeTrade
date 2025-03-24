# PokéTrade
The web app to manage trade requests/offers.

## Table of Contents
- [First Access](#first-access)
- [Updating Wishlist and Offers](#updating-wishlist-and-offers)
- [Searching for Trades](#searching-for-trades)
- [Account Settings](#account-settings)
- [FAQs](#faqs)
- [File Structure](#file-structure)
- [Contributing](#contributing)

## First Access
When a user first accesses the web app, they will be asked to complete a couple of steps.
1. User will need to log in using discord
2. User needs to link their Pokémon TCG Pocket account
3. After completing this they will then be able to search for available trades

## Updating Wishlist and Offers
1. User can edit these lists from the `Home` page or `MyAccount` page.
2. User can add the Pokémons they are looking for to their Wishlist
3. User can add the Pokémons they are looking to trade away to their List for Trading
NOTE: A Pokémon can only be in your Wishlist or List for Trading and not both at the same time.

## Searching for Trades
You can see what trades are available out there in the `Home` page. This is where you can also reach out to folks to initiate a trade.
1. User selects a Pokémon from their wishlist
2. They will then be able to see all offers for that Pokémon
3. Send a message to that person in a Discord server
4. Make updates to your wishlist to search for more Pokémons

## Account Settings
You can see the profile icon on the top right. There is a little indicator for the status of your account.
Clicking the icon will redirect you to the `MyAccount` page where you can view information on your account.
From here you can:
1. Change account status (Green: Available, Red: Unavailable)
  - This controls whether your trade offers will show up in searches
2. Log out

## FAQs


## File Structure
- `package.json` and `tsconfig.json`: These files are used to configure React
- `src/`: This is where your bot code would live
   - `./index.tsx`: Entrypoint of your app
   - `./App.tsx`: All routes
   - `./pages/*`: Page for each route
   - `./components/*`: Individual components to add to pages
   - `./styles/*`: Custom Sass styling
   - `./utils/*` TypeScript types and functions
   - `./utils/contexts/*`: Information to pass between pages without having to explicitly pass through props
- All other files are auto generated so they do not need to be touched.

## Contributing
This web app is built in React.
The languages we are using are TypeScript.
Learn more about React in [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and [React documentation](https://reactjs.org/).

To start:
1. Fill out `../.env.example` and copy it to `webapp/` as a `.env` file
2. Copy over `../api/prisma/schema.prisma` to `webapp/` so the Prisma Client can be generated
3. Run script `npm install` to install dependencies
4. Run script `npx prisma generate` to build the Prisma Client

To run app in development mode:
1. Run script `npm start`.
2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

To run tests:
1. Run script `npm test`.
2. This will launch the test runner in the interactive watch mode.
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

To build the app for production:
1. Run script `npm run build`.
2. App will be built in the `build` folder.
It correctly bundles app in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.

To deploy the built app:
See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
