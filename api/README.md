# PokéTrade
The back end server to manage trade requests/offers.

## Table of Contents
- [FAQs](#faqs)
- [File Structure](#file-structure)
- [Contributing](#contributing)

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