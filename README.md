# Asian Hornet Watch app

## Contribution

Think you've found a bug or have a new feature to suggest?
[Let us know!](https://github.com/NERC-CEH/hornet-watch-app/issues)

## Questions

If you have any questions, please feel free to ask on the
[iRecord forum](http://www.irecord.org.uk).


## Configuration

App configuration is hosted in `config/config.js`. **Note:** it should be done
 *before* building the code.


## Building

- Install [NodeJS](http://nodejs.org/)
- Install SASS 

```bash
gem install sass
```

- Get a copy of the code by running:

```bash
git clone git://github.com/NERC-CEH/hornet-watch-app.git
```

- Enter the `hornets-app` directory and install the npm build dependencies:

```bash
cd hornet-watch-app && npm install
```


### Cordova mobile app

- Build the project:

```bash
grunt cordova
```

- Update Cordova project with new web pages (replaces the www)

```bash
grunt cordova:update
```

### Web app

If you are building for the web platform only:

`Production`

```bash
grunt
```

`Development`

```bash
grunt dev
```

This will create a `dist` folder with the app code and its dependencies.


## Running app locally

- [Express](http://expressjs.com/) framework is provided for a quick
launch of a web server.

```bash
node config/server.js
```

- Open the app on a browser [http://localhost:8000](http://localhost:8000)


## Authors

[Karolis Kazlauskis](https://github.com/kazlauskis)


## Copyright and license

Code copyright 2017 Centre for Ecology & Hydrology.
Code released under the [GNU GPL v3 license](LICENSE).
