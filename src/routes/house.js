import { userTable, houseTable, taskTable } from '../tables/index';
import { validHousename } from '../utils/util';
const express = require('express');
const router = express.Router();

const houseRouter = (db) => {
  // Create New House
  router.post('/', (req, res) => {
    if (req.user && req.user.isAuth) {
      console.log(`House: Create House Request started with user ${JSON.stringify(req.user)}`);
      const name = req.body.name;
      if (req.user.id) {
        db.findById(userTable, req.user.id).then((result) => {
          const user = result && result.length ? result[0] : null;
          if (user && user.isAdmin) {
            if (validHousename(name)) {
              db.insertRow(houseTable, { name }).then((id) => {
                res.status(200).json({ id, name });
              }).catch((ex) => {
                console.log('House: While inserting new house an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else {
              console.log('House name not valid!');
              res.status(400).send('House name not valid!');
            }
          } else {
            console.log('House: Create house is not allowed for regular users.');
            res.status(401).send('Create house not allowed for this user!');
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

  // Get All Houses
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
            db.findById(houseTable, user.houseId).then((houseResult) => {
              const foundHouse = houseResult && houseResult.length ? houseResult[0] : null;
              res.status(200).json(foundHouse);
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

  // Get house with id
  router.get('/:id', (req, res) => {
    const houseId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`House: Request started with user ${JSON.stringify(req.user)} and with house id ${houseId}`);
      if (Number.isInteger(houseId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            if (user && user.isAdmin) {
              db.findById(houseTable, houseId).then((houseResult) => {
                const house = houseResult && houseResult.length ? houseResult[0] : null;
                res.status(200).json(house);
              }).catch((ex) => {
                console.log('House: While fetching house with id', houseId, ' an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.houseId) {
              db.findById(houseTable, user.houseId).then((houseResult) => {
                const foundHouse = houseResult && houseResult.length ? houseResult[0] : null;
                res.status(200).json(foundHouse);
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
        console.log('House: Invalid house id param!');
        res.status(400).send('Invalid house id param!');
      }
    } else {
      console.log('House: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Delete house with id
  router.delete('/:id', (req, res) => {
    const houseId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`House: Delete request started with user ${JSON.stringify(req.user)} and with house id ${houseId}`);
      if (Number.isInteger(houseId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            if (user && user.isAdmin) {
              db.deleteById(houseTable, houseId).then(() => {
                res.status(200).send('House deleted with id ' + houseId);
              }).catch((ex) => {
                console.log('House: While deleting house with id', houseId, ' an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user) {
              res.status(401).send('User not allowed for this operation!');
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
        console.log('House: Invalid house id param!');
        res.status(400).send('Invalid house id param!');
      }
    } else {
      console.log('House: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Get house users
  /* eslint-disable no-param-reassign */
  router.get('/:id/users', (req, res) => {
    const houseId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`House: Request started with user ${JSON.stringify(req.user)} and with house id ${houseId}`);
      if (Number.isInteger(houseId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            if (user && user.isAdmin) {
              db.selectWithWhereCondition(userTable, { houseId }).then((houseUsers) => {
                res.status(200).json(houseUsers);
              }).catch((ex) => {
                console.log('House: While fetching users for house with id', houseId, ' an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.houseId && user.houseId === houseId) {
              db.selectWithWhereCondition(userTable, { houseId }).then((houseUsers) => {
                res.status(200).json(houseUsers.map((houseUser) => {
                  delete houseUser.isAdmin;
                  delete houseUser.lastname;
                  return houseUser;
                }));
              }).catch((ex) => {
                console.log('House: While fetching house users an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.houseId && user.houseId !== houseId) {
              res.status(401).json('Not authorized to see users for other houses!');
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
        console.log('House: Invalid house id param!');
        res.status(400).send('Invalid house id param!');
      }
    } else {
      console.log('House: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Get house tasks
  router.get('/:id/tasks', (req, res) => {
    const houseId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`House: Request started with user ${JSON.stringify(req.user)} and with house id ${houseId}`);
      if (Number.isInteger(houseId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            if (user && user.isAdmin) {
              db.selectWithWhereCondition(taskTable, { houseId }).then((houseTasks) => {
                res.status(200).json(houseTasks);
              }).catch((ex) => {
                console.log('House: While fetching tasks for house with id', houseId, ' an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.houseId && user.houseId === houseId) {
              db.selectWithWhereCondition(taskTable, { houseId }).then((houseTasks) => {
                res.status(200).json(houseTasks);
              }).catch((ex) => {
                console.log('House: While fetching house tasks an error occured:', ex);
                res.status(500).send('Unexpected error occured!');
              });
            } else if (user && user.houseId && user.houseId !== houseId) {
              res.status(401).json('Not authorized to see tasks for other houses!');
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
        console.log('House: Invalid house id param!');
        res.status(400).send('Invalid house id param!');
      }
    } else {
      console.log('House: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });
  return router;
};


module.exports = houseRouter;
