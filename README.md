# Non-zone app

#### Non-Zone application is the global map for experiential and solo-travelers. "Pin" a new location, or discover a new "magic" place. Anywhere, at any time.

First available release (mobile preferly): https://non-zone.web.app <br/>
Here you can find the description: https://devpost.com/software/non-zone <br/>
Main stack: React, JavaScript, TS, CSS, HTML, NodeJS, Firebase <br/>
Collaborators: [Sergey Rudenko](https://github.com/rudensergey), [Dmitrii Yudakov](https://github.com/dmitry-yudakov)<br/>

![Interface](https://github.com/non-zone/non-zone/blob/master/webapp/media/readme.jpeg?raw=true)<br/>

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Webapp Deploy

Make sure to connect _non-zone_ Firebase project using _firebase init_.

```
cd non-zone/webapp

yarn build

firebase deploy
```
