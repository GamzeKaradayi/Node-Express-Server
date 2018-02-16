import { userTable, taskTable } from '../tables/index';

const express = require('express');
const router = express.Router();

const userRouter = (db) => {
  /* GET users listing. */
  router.get('/', (req, res) => {
    if (req.user && req.user.isAuth) {
      console.log(`User: Fetch user request started with user ${JSON.stringify(req.user)}`);
      if (req.user.id) {
        db.findById(userTable, req.user.id).then((result) => {
          const user = result && result.length ? result[0] : null;
          if (user && user.isAdmin) {
            db.selectAll(userTable).then((users) => {
              res.status(200).json(users);
            }).catch((ex) => {
              console.log('User: While fetching all users an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          } else {
            console.log('User: Fetch users is not allowed for regular users.');
            res.status(401).send('Fetch users not allowed for this user!');
          }
        }).catch((ex) => {
          console.log('User: While fetching user an error occured:', ex);
          res.status(500).send('Unexpected error occured!');
        });
      } else {
        res.status(400).send('Invalid token!');
      }
    } else {
      console.log('User: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Get user with id
  router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`User: Fetch user request started with user ${JSON.stringify(req.user)} and with user id ${userId}`);
      if (Number.isInteger(userId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            if (user && user.isAdmin) {
              db.findById(userTable, userId).then((userResult) => {
                const foundUser = userResult && userResult.length ? userResult[0] : null;
                res.status(200).json(foundUser);
              }).catch((ex) => {
                console.log('User: While fetching user with id', userId, ' an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.id === userId) {
              delete user.isAdmin;
              delete user.password;
              res.status(200).json(user);
            } else if (user) {
              res.status(401).json('Not authorized to see other users!');
            } else {
              res.status(500).send('User not found!');
            }
          }).catch((ex) => {
            console.log('User: While fetching user an error occured:', ex);
            res.status(500).send('Unexpected error occured!');
          });
        } else {
          res.status(400).send('Invalid token!');
        }
      } else {
        console.log('User: Invalid user id param!');
        res.status(400).send('Invalid user id param!');
      }
    } else {
      console.log('User: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Get user tasks
  router.get('/:id/tasks', (req, res) => {
    const userId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`User: Request started with user ${JSON.stringify(req.user)} and with user id ${userId}`);
      if (Number.isInteger(userId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            if (user && user.isAdmin) {
              db.selectWithWhereCondition(taskTable, { userId }).then((userTasks) => {
                res.status(200).json(userTasks);
              }).catch((ex) => {
                console.log('User: While fetching tasks for user with id', userId, ' an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.id === userId) {
              db.selectWithWhereCondition(taskTable, { userId: user.id }).then((userTasks) => {
                res.status(200).json(userTasks);
              }).catch((ex) => {
                console.log('User: While fetching user tasks an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user) {
              res.status(401).json('Not authorized to see tasks for other users!');
            } else {
              res.status(500).send('User not found!');
            }
          }).catch((ex) => {
            console.log('User: While fetching user an error occured:', ex);
            res.status(500).send('Unexpected error occured!');
          });
        } else {
          res.status(400).send('Invalid token!');
        }
      } else {
        console.log('User: Invalid user id param!');
        res.status(400).send('Invalid user id param!');
      }
    } else {
      console.log('User: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });
  return router;
};


module.exports = userRouter;
