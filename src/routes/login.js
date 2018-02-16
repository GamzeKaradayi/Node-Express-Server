import { userTable } from '../tables/index';
import { validUsername, validPassword } from '../utils/util';
import config from '../config/config';
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const loginRouter = (db) => {
  router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`Login: Request started with username: ${username} pass: ${password}`);
    if (validUsername(username) && validPassword(password)) {
      db.selectWithWhereCondition(userTable, { username, password }).then((result) => {
        const user = result && result.length ? result[0] : null;
        // user found
        if (user) {
          res.status(200).json({
            success: true,
            id: user.id,
            username: user.username,
            houseId: user.houseId,
            jwt: jwt.sign({
              id: user.id,
              username: user.username,
              admin: user.isAdmin,
              isAuth: true
            }, config.JWT.SECRET)
          });
        } else {
          res.status(400).send('User not found!');
        }
      }).catch((ex) => {
        console.log('Register: While fetching houses an error occured: ', ex);
        res.status(500).send('Failed');
      });
    } else {
      if (!validUsername(username)) {
        res.status(400).send('Invalid Username!');
      } else if (!validPassword(password)) {
        res.status(400).send('Invalid Password!');
      } else {
        res.status(400).send('Uknown Reason!');
      }
    }
  });
  return router;
};


module.exports = loginRouter;
