// const mysql = require('mysql');
import mysql from 'mysql';

let connection;

const getDatabaseConnection = () => {
  if(!connection) {
    connection = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: process.env.DB_CHARSET
    })
  }
  return connection;
};

const query = (query, params = []) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      connection = getDatabaseConnection();
    }
    connection.query(query, params, (err, results, fields) => {
      if(err) {
        reject(err);
        return;
      }
      resolve({
        results: results,
        fields: fields
      })
    })
  });
};

const close = () => {
  if(connection) {
    connection.end();
    connection = null;
  }
};

export {
  getDatabaseConnection,
  query,
  close
}