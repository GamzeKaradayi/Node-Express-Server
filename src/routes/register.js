import { userTable, houseTable } from '../tables/index';
import { validUsername, validPassword } from '../utils/util';

const express = require('express');
const router = express.Router();

const registerRouter = (db) => {
  router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const houseId = req.body.houseId;
    console.log(`Register: Request started with username: ${username} pass: ${password} houseId: ${houseId}.`);
    if (validUsername(username) && validPassword(password) && Number.isInteger(houseId)) {
      db.selectAll(houseTable).then((houses) => {
        // house found
        if (houses.find((house) => house.id === houseId)) {
          db.insertRow(userTable, { username, password, houseId }).then(() => {
            console.log(`Register: Successfully new user added with username: ${username} pass: ${password} houseId: ${houseId}.`);
            res.status(200).send('Success');
          }).catch((ex) => {
            console.log('Register: While insterting new user an error occured: ', ex);
            res.status(500).send('Failed');
          });
        } else { // house not found
          db.insertRow(userTable, { username, password }).then(() => {
            console.log(`Register: Successfully new user added with username: ${username} pass: ${password}.`);
            res.status(200).send('Success');
          }).catch((ex) => {
            console.log('Register: While insterting new user an error occured: ', ex);
            res.status(500).send('Failed');
          });
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
      } else if (!Number.isInteger(houseId)) {
        res.status(400).send('Invalid House!');
      } else {
        res.status(400).send('Uknown Reason!');
      }
    }
  });
  return router;
};


module.exports = registerRouter;
