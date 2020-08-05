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
-   _functions_ - Firebase Cloud functions used for API and DB triggers

Run `yarn install` initially in one the modules your're working on, e.g.:

```
cd webapp/

yarn install
```

Then start the module in development mode

```
yarn start
```

See the instructions printed in console for more information.

### Deployment of webapp and functions

In project root execute either `yarn deploy:dev` or `yarn deploy:prod` command - it will set the appropriate environment variable, build the webapp module and deploy _webapp_, _functions_ along with _database.rules_.
