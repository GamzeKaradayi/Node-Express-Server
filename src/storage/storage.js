'use strict';

const mysql = require('mysql');
const CONFIG = require('../config/config.js');
let connectedClusterName;
let connectedInstance;
const connect = () => Promise.resolve().then(() => {
  const poolCluster = mysql.createPoolCluster();
  const clusters = Object.keys(CONFIG.DB);

  clusters.forEach(cluster => {
    poolCluster.add(cluster, {
      host: CONFIG.DB[cluster].HOST || 'localhost',
      user: CONFIG.DB[cluster].USER || 'root',
      password: CONFIG.DB[cluster].PASSWORD || '123456',
      database: CONFIG.DB[cluster].DATABASE || 'houseworkup'
    });
  });

  const getConnection = () => new Promise((resolve, reject) => {
    if (connectedClusterName && connectedInstance) {
      resolve(connectedInstance);
    } else if (clusters.length > 0) {
      connectedClusterName = connectedClusterName || clusters[0];
      console.log('Trying to connect cluster ', connectedClusterName);
      poolCluster.getConnection(connectedClusterName, (err, connection) => {
        if (err) {
          reject(err);
        } else {
          connectedInstance = connection;
          resolve(connection);
        }
      });
    } else {
      const errMessage = 'At least have one db cluster! Check configurations.';
      reject(errMessage);
    }
  });

  const changeCluster = (clusterName) => {
    if (connectedClusterName !== clusterName && clusters.indexOf(clusterName) >= 0) {
      connectedInstance.end();
      connectedInstance = undefined;
      connectedClusterName = clusterName;
    } else if (connectedClusterName === clusterName) {
      console.log('Already connected cluster:', clusterName);
    } else {
      console.log('Cluster not exist: ', clusterName);
    }
  };

  const selectAll = (table) => new Promise((resolve, reject) => {
    getConnection().then((connection) => connection.query(`SELECT * FROM ${table.name}`, (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Select success table: ', table.name);
        resolve(rows);
      }
    }));
  });

  const selectWithWhereCondition = (table, where) => new Promise((resolve, reject) => {
    const whereKeys = Object.keys(where).map((wk) => wk + '= ?').join(' AND ');
    const whereValues = Object.keys(where).map((wk) => where[wk]);

    getConnection().then((connection) => connection.query(`SELECT * FROM ${table.name} WHERE ${whereKeys}`, whereValues, (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Select with condition success table: ', table.name, ' with where ', where);
        resolve(rows);
      }
    }));
  });

  const findById = (table, id) => new Promise((resolve, reject) => {
    getConnection().then((connection) => connection.query(`SELECT * FROM ${table.name} WHERE id = ? LIMIT 1`, [id], (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Find success table: ', table.name, ' with id ', id);
        resolve(rows);
      }
    }));
  });

  const deleteById = (table, id) => new Promise((resolve, reject) => {
    getConnection().then((connection) => connection.query(`DELETE FROM ${table.name} WHERE id = ?`, [id], (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Delete success table: ', table.name, ' with id ', id);
        resolve(rows);
      }
    }));
  });

  const insertRow = (table, row) => new Promise((resolve, reject) => {
    getConnection().then((connection) => connection.query(`INSERT INTO ${table.name} SET ?`, row, (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Insert success row: ', row);
        resolve(rows.insertId);
      }
    }));
  });

  const updateWithWhereCondition = (table, updates, where) => new Promise((resolve, reject) => {
    const whereKeys = Object.keys(where).map((wk) => wk + '= ?').join(' AND ');
    const whereValues = Object.keys(where).map((wk) => where[wk]);
    const updateKeys = Object.keys(updates).map((uk) => uk + '= ?').join(' , ');
    const updateValues = Object.keys(updates).map((uk) => updates[uk]);

    const allValues = updateValues.concat(whereValues);

    getConnection().then((connection) =>
      connection.query(`UPDATE ${table.name} SET ${updateKeys} WHERE ${whereKeys}`, allValues, (err, rows, fields) => {
        if (err) reject(err);
        else {
          console.log('Storage: Select with condition success table: ', table.name, ' with where ', where);
          resolve();
        }
      }));
  });

  const deleteRow = (table, row) => new Promise((resolve, reject) => {
    getConnection().then((connection) => connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('The solution is: ', rows[0].solution);
        resolve();
      }
    }));
  });

  return {
    selectAll,
    selectWithWhereCondition,
    updateWithWhereCondition,
    findById,
    deleteById,
    insertRow,
    deleteRow,
    changeCluster
  };
}).catch((e) => {
  console.log('Storage: While connecting db instance an error occured:', e);
  throw e;
});


// Close connection
const quit = () => {
  if (connectedInstance) {
    connectedInstance.end();
  }
};

module.exports = { connect, quit };
