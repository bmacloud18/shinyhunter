// const mysql = require('mysql');
import mysql from 'mysql2/promise';
import 'dotenv/config'
import {log, error} from 'console';

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

const query = async (query, params = []) => {
  if(!connection) {
    connection = getDatabaseConnection();
  }

  try {
    const [results, fields] = await connection.query(query, params);
    return {results, fields};
  }
  catch (err) {
    throw err;
  }
};

const close = async () => {
  if(connection) {
    await connection.end();
    connection = null;
  }
};

export {
  getDatabaseConnection,
  query,
  close
}