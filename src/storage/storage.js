'use strict';

const mysql = require('mysql');
const uid = require('uid');
const CONFIG = require('../config/config.js');

const connect = () => Promise.resolve().then(() => {
  const connection = mysql.createConnection({
    host: CONFIG.DB.HOST || 'localhost',
    user: CONFIG.DB.USER || 'root',
    password: CONFIG.DB.PASSWORD || '357159',
    database: CONFIG.DB.DATABASE || 'houseworkup'
  });

  connection.connect();

  const selectAll = (table) => new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table.name}`, (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Select success table: ', table.name);
        resolve(rows);
      }
    });
  });

  const selectWithWhereCondition = (table, where) => new Promise((resolve, reject) => {
    const whereKeys = Object.keys(where).map((wk) => wk + '= ?').join(' AND ');
    const whereValues = Object.keys(where).map((wk) => where[wk]);

    connection.query(`SELECT * FROM ${table.name} WHERE ${whereKeys}`, whereValues, (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Select with condition success table: ', table.name, ' with where ', where);
        resolve(rows);
      }
    });
  });

  const findById = (table, id) => new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table.name} WHERE id = ? LIMIT 1`, [id], (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Find success table: ', table.name, ' with id ', id);
        resolve(rows);
      }
    });
  });

  const insertRow = (table, row) => new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table.name} SET ?`, row, (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('Storage: Insert success row: ', row);
        resolve();
      }
    });
  });

  const deleteRow = (table, row) => new Promise((resolve, reject) => {
    connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
      if (err) reject(err);
      else {
        console.log('The solution is: ', rows[0].solution);
        resolve();
      }
    });
  });

  return {
    selectAll,
    selectWithWhereCondition,
    findById,
    insertRow,
    deleteRow
  };
}).catch((e) => {
  console.log('Storage: While connecting db instance an error occured:', e);
  throw e;
});


// Close connection
const quit = (connection) => {
  if (connection) {
    connection.end();
  }
};

module.exports = { connect, quit };
