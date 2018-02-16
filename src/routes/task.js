import { userTable, houseTable, taskTable } from '../tables/index';
import { validTaskdescription } from '../utils/util';
const express = require('express');
const router = express.Router();

const taskRouter = (db) => {
  // Create new task
  router.post('/', (req, res) => {
    if (req.user && req.user.isAuth) {
      console.log(`Task: Create Task Request started with user ${JSON.stringify(req.user)}`);
      const description = req.body.description;
      const houseId = req.body.houseId;
      if (req.user.id) {
        if (validTaskdescription(description) && Number.isInteger(houseId)) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            db.findById(houseTable, houseId).then((houseResult) => {
              const foundHouse = houseResult && houseResult.length ? houseResult[0] : null;
              if (foundHouse) {
                if (user.isAdmin || user.houseId === houseId) {
                  db.insertRow(taskTable, { description, houseId, createdUserId: user.id }).then((id) => {
                    res.status(200).json({
                      id,
                      description,
                      houseId,
                      userId: null
                    });
                  }).catch((ex) => {
                    console.log('Task: While creating new task an error occured:', ex);
                    res.status(500).send('Unexpected error occured!');
                  });
                } else {
                  console.log('Task: User not allowed to insert task for other houses!');
                  res.status(400).send('User not allowed to insert task for other houses!');
                }
              } else {
                console.log('Task:  House not found!');
                res.status(400).send('House not found!');
              }
            }).catch((ex) => {
              console.log('Task: While fetching given house an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          }).catch((ex) => {
            console.log('Task: While fetching request user an error occured:', ex);
            res.status(500).send('Unexpected error occured!');
          });
        } else {
          console.log('Task: Task params invalid!');
          res.status(400).send(' Task params invalid!');
        }
      } else {
        res.status(400).send('Invalid token!');
      }
    } else {
      console.log('Task: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Get All Tasks
  router.get('/', (req, res) => {
    if (req.user && req.user.isAuth) {
      console.log(`Task: Request started with user ${JSON.stringify(req.user)}`);
      if (req.user.id) {
        db.findById(userTable, req.user.id).then((result) => {
          const user = result && result.length ? result[0] : null;
          if (user && user.isAdmin) {
            db.selectAll(taskTable).then((tasks) => {
              res.status(200).json(tasks);
            }).catch((ex) => {
              console.log('Task: While fetching all tasks an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          } else if (user) {
            db.selectWithWhereCondition(taskTable, { userId: user.id }).then((tasks) => {
              res.status(200).json(tasks);
            }).catch((ex) => {
              console.log('Task: While fetching user tasks an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          } else if (user) {
            res.status(200).json([]);
          } else {
            res.status(500).send('User not found!');
          }
        }).catch((ex) => {
          console.log('Task: While fetching user an error occured:', ex);
          res.status(500).send('Unexpected error occured!');
        });
      } else {
        res.status(400).send('Invalid token!');
      }
    } else {
      console.log('Task: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Get task with id
  router.get('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`Task: Request started with user ${JSON.stringify(req.user)} and with id ${taskId}`);
      if (Number.isInteger(taskId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            db.findById(taskTable, taskId).then((taskResult) => {
              const foundTask = taskResult && taskResult.length ? taskResult[0] : null;
              if (user && user.isAdmin && foundTask) {
                res.status(200).json(foundTask);
              } else if (user && foundTask && foundTask.houseId === user.houseId) {
                res.status(200).json(foundTask);
              } else if (user && foundTask) {
                res.status(401).json('User not allowed to see this task!');
              } else if (!foundTask) {
                res.status(400).send('Task not found wiht id ' + taskId);
              } else {
                res.status(500).send('User not found!');
              }
            }).catch((ex) => {
              console.log('Task: While fetching task an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          }).catch((ex) => {
            console.log('Task: While fetching user an error occured:', ex);
            res.status(500).send('Unexpected error occured!');
          });
        } else {
          res.status(400).send('Invalid token!');
        }
      } else {
        console.log('House: Invalid task id param!');
        res.status(400).send('Invalid task id param!');
      }
    } else {
      console.log('Task: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Update task with id
  router.put('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 0);
    const description = req.body.description;
    const done = req.body.done;
    const userId = req.body.userId;
    if (req.user && req.user.isAuth) {
      console.log(`Task: Update Task request started with user ${JSON.stringify(req.user)} and with id ${taskId}`);
      if (Number.isInteger(taskId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            db.findById(taskTable, taskId).then((taskResult) => {
              const foundTask = taskResult && taskResult.length ? taskResult[0] : null;
              if (validTaskdescription(description)) {
                if (userId && Number.isInteger(userId)) {
                  db.findById(userTable, userId).then((assigneeUserResult) => {
                    const assigneeUser = assigneeUserResult && assigneeUserResult.length ? assigneeUserResult[0] : null;
                    if (!assigneeUser || assigneeUser.houseId !== foundTask.houseId) {
                      console.log(`Task: This is not allowed operation whether assignee user not exist with id ${userId} or houses are not matched!`);
                      res.status(400).send('This is not allowed operation check assigned user!');
                    } else if (user && user.isAdmin && foundTask) {
                      db.updateWithWhereCondition(taskTable, { description, done, userId }, { id: taskId }).then(() => {
                        res.status(200).json({
                          id: taskId,
                          description,
                          done,
                          userId,
                          houseId: foundTask.houseId
                        });
                      }).catch((ex) => {
                        console.log('Task: While udpating task unexpected error occured:', ex);
                        res.status(500).send('Unexpected error occured.');
                      });
                    } else if (user && foundTask && foundTask.houseId === user.houseId) {
                      db.updateWithWhereCondition(taskTable, { done, userId }, { id: taskId }).then(() => {
                        res.status(200).json({
                          id: taskId,
                          description: foundTask.description,
                          done,
                          userId,
                          houseId: foundTask.houseId
                        });
                      }).catch((ex) => {
                        console.log('Task: While udpating task unexpected error occured:', ex);
                        res.status(500).send('Unexpected error occured.');
                      });
                    } else if (user && foundTask) {
                      console.log('Task: User not allowed to update this task with user ' + user);
                      res.status(401).json('User not allowed to update this task!');
                    } else if (!foundTask) {
                      console.log('Task: Task not found wiht id ' + taskId);
                      res.status(400).send('Task not found wiht id ' + taskId);
                    } else {
                      console.log('Task: Request user not found!');
                      res.status(500).send('User not found!');
                    }
                  }).catch((ex) => {
                    console.log('Task: While fetching assginee user an error occured:', ex);
                    res.status(500).send('Unexpected error occured!');
                  });
                } else {
                  if (user && user.isAdmin && foundTask) {
                    db.updateWithWhereCondition(taskTable, { description, done, userId }, { id: taskId }).then(() => {
                      res.status(200).json({
                        id: taskId,
                        description,
                        done,
                        userId,
                        houseId: foundTask.houseId
                      });
                    }).catch((ex) => {
                      console.log('Task: While udpating task unexpected error occured:', ex);
                      res.status(500).send('Unexpected error occured.');
                    });
                  } else if (user && foundTask && foundTask.houseId === user.houseId) {
                    db.updateWithWhereCondition(taskTable, { done, userId }, { id: taskId }).then(() => {
                      res.status(200).json({
                        id: taskId,
                        description: foundTask.description,
                        done,
                        userId,
                        houseId: foundTask.houseId
                      });
                    }).catch((ex) => {
                      console.log('Task: While udpating task unexpected error occured:', ex);
                      res.status(500).send('Unexpected error occured.');
                    });
                  } else if (user && foundTask) {
                    console.log('Task: User not allowed to update this task with user ' + user);
                    res.status(401).json('User not allowed to update this task!');
                  } else if (!foundTask) {
                    console.log('Task: Task not found wiht id ' + taskId);
                    res.status(400).send('Task not found wiht id ' + taskId);
                  } else {
                    console.log('Task: Request user not found!');
                    res.status(500).send('User not found!');
                  }
                }
              } else {
                console.log('Task: Invalid task description!');
                res.status(400).send('Invalid task description with ' + description);
              }
            }).catch((ex) => {
              console.log('Task: While fetching task an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          }).catch((ex) => {
            console.log('Task: While fetching user an error occured:', ex);
            res.status(500).send('Unexpected error occured!');
          });
        } else {
          res.status(400).send('Invalid token!');
        }
      } else {
        console.log('House: Invalid task id param!');
        res.status(400).send('Invalid task id param!');
      }
    } else {
      console.log('Task: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });

  // Delete task with id
  router.delete('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 0);
    if (req.user && req.user.isAuth) {
      console.log(`Task: Delete request started with user ${JSON.stringify(req.user)} and with task id ${taskId}`);
      if (Number.isInteger(taskId)) {
        if (req.user.id) {
          db.findById(userTable, req.user.id).then((result) => {
            const user = result && result.length ? result[0] : null;
            db.findById(taskTable, taskId).then((taskResult) => {
              const task = taskResult && taskResult.length ? taskResult[0] : null;
              if (task && user && user.isAdmin) {
                db.deleteById(taskTable, taskId).then(() => {
                  res.status(200).send('Task deleted with id ' + taskId);
                }).catch((ex) => {
                  console.log('Task: While deleting task with id', taskId, ' an error occured:', ex);
                  res.status(500).send('Unexpected error occured!');
                });
              } else if (task && user && task.houseId === user.houseId) {
                db.deleteById(taskTable, taskId).then(() => {
                  res.status(200).send('Task deleted with id ' + taskId);
                }).catch((ex) => {
                  console.log('Task: While deleting task with id', taskId, ' an error occured:', ex);
                  res.status(500).send('Unexpected error occured!');
                });
              } else if (task && user) {
                res.status(401).send('User not allowed for this operation!');
              } else if (task) {
                res.status(401).send('Task not found!');
              } else {
                res.status(500).send('User not found!');
              }
            }).catch((ex) => {
              console.log('Task: While fetching task for deletion an error occured:', ex);
              res.status(500).send('Unexpected error occured!');
            });
          }).catch((ex) => {
            console.log('Task: While fetching user an error occured:', ex);
            res.status(500).send('Unexpected error occured!');
          });
        } else {
          res.status(400).send('Invalid token!');
        }
      } else {
        console.log('Task: Invalid task id param!');
        res.status(400).send('Invalid task id param!');
      }
    } else {
      console.log('Task: Unauthorized request responded with 401.');
      res.status(401).send('Unauthorized user!');
    }
  });
  return router;
};


module.exports = taskRouter;
