# PokéTrade
The web app to manage trade requests/offers.

## Table of Contents
- [First Access](#first-access)
- [FAQs](#faqs)
- [File Structure](#file-structure)
- [Contributing](#contributing)

## First Access
When a user first accesses the web app, they will be asked to complete a couple of steps.
1. User needs to link an account
2. User will select the Pokémons they are looking for to their Wishlist
3. User will select the Pokémons they are looking to trade away to their List for Trading
4. After completing this will they then be able to search for available trades

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


To run app in development mode:
1. Copy over `../api/prisma/schema.prisma` to `webapp/` so the Prisma Client can build out correctly
2. Install node dependencies using `npm install`
3. Make sure your prisma client is up to date by running `npx prisma generate`.
4. Run script `npm start`.
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
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
