## Univ Auth

[![GitHub version](https://badge.fury.io/gh/xrobert35%2Funiv-auth.svg)](https://github.com/xrobert35/univ-auth)
[![Coverage Status](https://coveralls.io/repos/github/xrobert35/univ-auth/badge.svg)](https://coveralls.io/github/xrobert35/univ-auth)
[![GitHub version](https://img.shields.io/badge/licence-MIT-green.svg)](https://github.com/xrobert35/univ-auth)

## General informations

This project is a simple authentitacion server

## Usefull informations

### Launching project
This project can be launch by doing  **npm run start**
You can also use the existing **vscode** configuration

You will need a mongodb to make it work, you can 

#### Script package.json

| Commande   | Description    |
| ------------ | ------------ |
| start  |  Launch the project |
| start:prod | Launch the builded project in prod mode   |
| build  | Build the project  |
| test:unit |  Launch jest unit test |
| test:e2e |  Launch jest e2e test |

### Configuration

By default the project is configured thanks to **src/config/default.js**
This configuration can be overrided by another file if you specify another one thanks to **NODE_ENV**
Exemple NODE_ENV=development  will load the **default.js** and will override it with **src/config/development.js**

#### Usable environment var

|  Variable | Description   |
| ------------ | ------------ |
| MONGO_URL   | Mongo URL   |
| SERVER_PORT | Server PORT |
| SERVER_PATH | Server base path |
| LOG_LEVEL  |  Log level |
| AUTH_TOKEN_NAME  |  Auth token name |
| AUTH_JWT_KEY  |  Private key used to encrypt the jwt token |
| SWAGGER_ACTIVATED | active or not the swagger |
| ADMIN_ACCOUNT | admin login |
| ADMIN_PWD | admin password |

#### Used framework links :

- nestjs : https://docs.nestjs.com/controllers