# Getting Started with this project
change the env urls in `src/common/constants/default-values.js`
```
const config = {
    development: {
        APIServerURL: `${HOST}:3300/apis`,
        AssetsServerURL: `${HOST}:3300`,
        SocketServerURL: `${HOST}:3030`,
    },
    production: {
        APIServerURL: `http://ba2abe57bef3.ngrok.io/apis`,
        AssetsServerURL: `http://ba2abe57bef3.ngrok.io`,
        SocketServerURL: `http://f4414683f9fb.ngrok.io`,
    }
}
```
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
