# Simple ReactJS components with Kaltura Super Powers

This is a package of simple react components that work with Kaltura.

## To install

```bash
npm i @chieftroublemaker/simple-kaltura-react-components
```

Then you can include the components in your React app.

## The components in the package

- Player - Loading and interacting with the Kaltura Player v7 (aka [kaltura-player-js](https://github.com/kaltura/kaltura-player-js))
- PlayersGallery - A gallery of Kaltura Players utilizing simple divs and the Player component. You can use CSS to style and order the gallery.
- SearchResultsWithGallery - Simple view for displaying search results with an integrated Kaltura Players gallery and interactive search sentences.
- EmbeddedKalturaSearchView - Embedded Kaltura search view with an input search query, and summarized search answer with interactive sentences and Kaltura Players.

## Dev env

- `/lib/components` - the components
- `/testapp` - a simple test app that embeds the components for local testing of the package

## Setting up the dev env

- Clone/Checkout the repository.
- In the root project of the project (where `lib` folder is) run: `npm link`
- `npm install`
- `cd testapp`
- `npm link @kaltura/simple-react-components` - this will link the local lib to the test project.
- `npm install`
- `cp testapp/src/config.json.template testapp/src/config.json`
- edit [config.json](/testapp/src/config.json.template) and update to your Kaltura credentials and settings

> To remove the local link run:
> `npm unlink @kaltura/simple-react-components`

## To run in dev mode

From the root dir, run: `npm run dev`.
This will build the components into ./dist and `testapp` into ./build , start the dev server for testapp, and then open the browser on localhost:9000.

## To build both the test app and library

From the root dir, run: `npm run build_both`.

## To build just the components library

From the root dir, run: `npm run build`.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.
