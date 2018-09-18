# project-api

Project's API

+ express
+ mongoose
+ babel-cli
+ winston and morgan for logging
+ Async/Await

## Installation

Clone the repository and run `yarn install`

```
git clone https://github.com/boubaks/project-api.git
yarn install
```

## Starting the server

```
yarn start
```

The server will run on port 8080. You can change this by editing `config.dev.js` file.

## Run server in production with Docker

```
yarn run build
```

After yarn building the project, go to project root directory, open shell and run:
```
docker build -t project-api .
```