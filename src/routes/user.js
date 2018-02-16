import { userTable } from '../tables/index';

const express = require('express');
const router = express.Router();

const userRouter = (db) => {
  /* GET users listing. */
  router.get('/', (req, res) => {
    db.selectAll(userTable).then((users) => res.send('Users:' + JSON.stringify(users)));
  });
  return router;
};


module.exports = userRouter;
