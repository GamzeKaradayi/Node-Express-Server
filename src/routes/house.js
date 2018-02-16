import { userTable, houseTable } from '../tables/index';
const express = require('express');
const router = express.Router();

const houseRouter = (db) => {
  router.get('/', (req, res) => {
    if (req.user && req.user.isAuth) {
      console.log(`House: Request started with user ${JSON.stringify(req.user)}`);
      if (req.user.id) {
        db.findById(userTable, req.user.id).then((result) => {
          const user = result && result.length ? result[0] : null;
          if (user && user.isAdmin) {
            db.selectAll(houseTable).then((houses) => {
              res.status(200).json(houses);
            }).catch((ex) => {
              console.log('House: While fetching all houses an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          } else if (user && user.houseId) {
            db.findById(houseTable, user.houseId).then((houses) => {
              res.status(200).json(houses);
            }).catch((ex) => {
              console.log('House: While fetching house an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          } else if (user) {
            res.status(200).json([]);
          } else {
            res.status(500).send('User not found!');
          }
        }).catch((ex) => {
          console.log('House: While fetching user an error occured:', ex);
          res.status(500).send('Unexpected error occured!');
        });
      } else {
        res.status(400).send('Invalid token!');
      }
    } else {
      console.log('House: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });
  return router;
};


module.exports = houseRouter;
