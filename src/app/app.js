'use strict';

import config from '../config/config';
import userRouter from '../routes/user';
import registerRouter from '../routes/register';
import loginRouter from '../routes/login';
import houseRouter from '../routes/house';
import taskRouter from '../routes/task';

const express = require('express');
const expressjwt = require('express-jwt');
const bodyParser = require('body-parser');
const app = express();

const start = (db) => new Promise((resolve, reject) => {
  try {
    // CORS middleware
    const allowCrossDomain = (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    };
    app.use(allowCrossDomain);

    // Body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // JWT Token Auth
    app.use(expressjwt({
      secret: config.JWT.SECRET,
      credentialsRequired: false,
      getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization) {
          return req.headers.authorization;
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      }
    }));

    // Routes
    app.use('/users', userRouter(db));
    app.use('/register', registerRouter(db));
    app.use('/login', loginRouter(db));
    app.use('/houses', houseRouter(db));
    app.use('/tasks', taskRouter(db));
    app.get('/*', (req, res, next) => {
      res.status(200).send('404');
    });

    // Error handling
    app.use((err, req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token!');
      }
    });

    console.log('App: Express app is ready.');
    resolve(app);
  } catch (e) {
    console.log('App: Unexpected error occured: ', e);
    reject(e);
  }
});

module.exports = { start };
