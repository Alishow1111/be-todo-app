const format = require('pg-format');
const db = require('../connection');
const bcrypt = require('bcrypt');

const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require('./utils');

const seed = ({usersData, todosData}) => {
  return db
    .query(`DROP TABLE IF EXISTS todos;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        password VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE todos (
        todo_id SERIAL PRIMARY KEY,
        task VARCHAR NOT NULL,
        created DATE NOT NULL,
        completed BOOLEAN DEFAULT FALSE, 
        master VARCHAR NOT NULL REFERENCES users(username)
      );`);
    })
    .then(() => {
      
      const saltRounds = 10;

      const hashedUsersData = usersData.map(({ username, password }) => {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        return [username, hashedPassword];
      });
      
      const insertUsersQueryStr = format(
        'INSERT INTO users (username, password) VALUES %L;',
        hashedUsersData
      );

      return db.query(insertUsersQueryStr);
      })
    .then(() => {
      const insertTodosQueryStr = format(
        'INSERT INTO todos ( task, created, completed, master) VALUES %L;',
        todosData.map(({ task, created, completed, master }) => [
          task,
          created,
          completed,
          master,
        ])
      );
      return db.query(insertTodosQueryStr)
    })
    
};

module.exports = seed;
