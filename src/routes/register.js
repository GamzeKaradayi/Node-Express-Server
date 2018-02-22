import { userTable, houseTable } from '../tables/index';
import { validFirstname, validLastname } from '../utils/util';
import config from '../config/config';
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const loginRouter = (db) => {
  router.post('/', (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const houseId = req.body.houseId;
    console.log(`Login: Request started with firstname: ${firstname} lastname: ${lastname}`);
    if (validFirstname(firstname) && validLastname(lastname) && Number.isInteger(houseId)) {
      db.selectWithWhereCondition(userTable, { firstname, lastname, houseId }).then((result) => {
        const user = result && result.length ? result[0] : null;
        // user found
        if (user) {
          res.status(200).json({
            success: true,
            id: user.id,
            firstname: user.firstname,
            houseId: user.houseId,
            jwt: jwt.sign({
              id: user.id,
              firstname: user.firstname,
              admin: user.isAdmin,
              isAuth: true
            }, config.JWT.SECRET)
          });
        } else {
          console.log('User not found. New user creating...!');
          db.selectAll(houseTable).then((houses) => {
            // house found
            if (houses.find((house) => house.id === houseId)) {
              db.insertRow(userTable, { firstname, lastname, houseId }).then((id) => {
                console.log(`Login Register: Successfully new user added with firstname: ${firstname} lasname: ${lastname} houseId: ${houseId}.`);
                res.status(200).json({ id, firstname, houseId });
              }).catch((ex) => {
                console.log('Login Register: While insterting new user an error occured: ', ex);
                res.status(500).send('Failed');
              });
            } else { // house not found
              console.log('Login Register: While creating new user an error occured: House not exist with given id!');
              res.status(400).send('House not exist with given id!');
            }
          }).catch((ex) => {
            console.log('Login Register: While fetching houses an error occured: ', ex);
            res.status(500).send('Failed');
          });
        }
      }).catch((ex) => {
        console.log('Login Register: While fetching houses an error occured: ', ex);
        res.status(500).send('Failed');
      });
    } else {
      if (!validFirstname(firstname)) {
        res.status(400).send('Invalid Firstname!');
      } else if (!validLastname(lastname)) {
        res.status(400).send('Invalid Lastname!');
      } else if (!Number.isInteger(houseId)) {
        res.status(400).send('Invalid HouseId!');
      } else {
        res.status(400).send('Uknown Reason!');
      }
    }
  });
  return router;
};


module.exports = loginRouter;
