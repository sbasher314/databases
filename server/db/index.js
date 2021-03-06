var mysql = require('mysql2/promise');

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'chat'
// });

// connection.connect();

// module.exports = connection;

const Sequelize = require('sequelize');

const initialize = async function () {
  const dbName = 'chat_test';
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  }).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
  }).then(res => {
    module.exports = new Sequelize(dbName, 'root', '', {dialect: 'mysql'});

    var User = module.exports.define('user', {
      username: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    var Room = module.exports.define('room', {
      roomname: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    var Message = module.exports.define('message', {
      text: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false
      },
      roomname: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: 'id'
        },
        allowNull: false
      },
      user: {
        type: Sequelize.INTEGER,
        references: {
          model: Room,
          key: 'id'
        },
        allowNull: false
      }
    });
    module.exports.sync();
  });

};

initialize();
// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".


