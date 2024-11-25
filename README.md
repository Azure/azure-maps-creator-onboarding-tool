# Azure Maps Manifest Tool

The Azure Maps Manifest Tool allows to interactively generate manifest files required for using the Creator Conversion Service. TEST DEPLOY

## Getting Started

1. Download [Node.js LTS](https://nodejs.org/en/download/) and install Node.js, if you don't have it already installed. Version 18 is recommended.
2. To install dependencies, run `npm install`.

After installing deps you may see concerning security messages like `6 high severity vulnerabilities`. Don't try to fix it by running `npm audit fix --force` as it may break your build. \
These vulnerabilities can be safely ignored as affected packages are only used in dev. To check production dependencies you may run `npm audit --production`, which should return `found 0 vulnerabilities`.

## Available commands

In the project directory, you also can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see lint errors in the console.

### `npm test`

(Unit Tests)\
Launches Jest test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:e2e`

(End-to-end Tests)\
Launches the Cypress client.\
See the section about [End-to-End Testing](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It bundles React in production mode and optimizes the build for the best performance.

If you plan to deploy to test environment you may want to add env variable REACT_APP_STAGING_ENV=true.\
This will add test endpoint to regions.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## API

All API requests live under `src/common/api/`.
API is designed to be used only by the onboarding tool and is not supported for any other use.

## Map interactions.

For map interactions we use following libraries:

- [azure-maps-control](https://www.npmjs.com/package/azure-maps-control)
- [react-azure-maps](https://github.com/Azure/react-azure-maps), usage examples [here](https://github.com/Azure/react-azure-maps-playground/tree/master/src/examples)
- [turf.js](http://turfjs.org/)
- [proj4](http://proj4js.org/)

More info on map calculations in src/common/store/geometry.store.readme.md.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
"# fabric-poc-ui" 
