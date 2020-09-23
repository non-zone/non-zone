# Non-zone app

#### Non-Zone application is the global map for experiential and solo-travelers. "Pin" a new location, or discover a new "magic" place. Anywhere, at any time.

First available release (mobile preferly): https://non-zone.web.app <br/>
Here you can find the description: https://devpost.com/software/non-zone <br/>
Main stack: React, JavaScript, TS, CSS, HTML, NodeJS, Firebase <br/>
Collaborators: [Sergey Rudenko](https://github.com/rudensergey), [Dmitrii Yudakov](https://github.com/dmitry-yudakov)<br/>

![Interface](https://github.com/non-zone/non-zone/blob/master/webapp/media/readme.jpeg?raw=true)<br/>

## Collaboration

Fork the project and then clone your fork. [Read more about Fork & PR strategy](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/working-with-forks)

```
git clone git@github.com:<YOUR_GITHUB_USER>/non-zone.git

cd non-zone/
```

The project has 3 main modules:

-   _app_ - react-native app
-   _webapp_ - create-react-app based webapp
-   _nonzone-lib_ - create-react-library based library with common functions for app/webapp
-   _functions_ - Firebase Cloud functions used for API and DB triggers

The project is a monorepo with _app_, _webapp_ and _nonzone-lib_ modules. _functions_ are separate for the moment.

Run `yarn install` initially in project root or one of the monorepo modules. Run it also in _functions_.

```
yarn install

```

Start building _nonzone-lib_ module:

```
cd nonzone-lib/

yarn start
```

In separate console run in development mode _app_ and/or _webapp_.

```
cd webapp/

yarn start
```

```
cd app/

yarn start
```

In case of _app_ issues, try running it with _expo start --clear_.

See the instructions printed in console for more information.

### Deployment of webapp and functions

#### Deploy firebase

In project root execute either `yarn deploy:dev` or `yarn deploy:prod` command - it will set the appropriate environment variable, build the _nonzone-lib_ and _webapp_ module and deploy _webapp_, _functions_ along with _database.rules_.

Just in case stop _yarn build_ in _nonzone-lib_ if you have it running.

#### Deploy Arweave

Use _yarn aw:build:dev_ or _yarn aw:build:prod_ commands for DEV/PROD builds using Arweave integration. Then deploy with _yarn aw:deploy_.

```
yarn aw:build:prod

yarn aw:deploy --key-file arweave.wallet.json
```
