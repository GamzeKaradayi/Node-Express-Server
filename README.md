# Overview
Backend server implementation with
* [NodeJS](https://nodejs.org/)
* [ExpressJS](https://expressjs.com)
* [MYSQL](https://www.mysql.com/)

API definitions json file can be found at *api-definitions* folder.

## Start Development
To start development follow steps:
* Install NodeJS
* Install MySql Server
* Run sql scripts
* * *src/scripts/initdb.sql*
* * *src/scripts/inittable.sql*
* Install node modules
`
	npm install
`
* Run npm start command
`
	npm start
`
Development server is started on http://localhost:8787

## Serve Production
To run app in production:
* Run npm start command
`
	npm run build
	npm run serve
`
Production server is started on http://localhost:8787