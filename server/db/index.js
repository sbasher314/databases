var mysql = require('mysql2/promise');
var { testing, dbName, drop} = require('../config.js');

const Sequelize = require('sequelize');

module.exports = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  }).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
  }).then(res => {
    const db = new Sequelize(dbName, 'root', '', {dialect: 'mysql'});

    var User = db.define('user',
      { username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }},
    );

    var Room = db.define('room',
      { roomname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }},
    );

    var Message = db.define('message',
      {
        text: {
          type: Sequelize.STRING,
          defaultValue: '',
          allowNull: false
        },
        roomId: {
          type: Sequelize.INTEGER,
          references: {
            model: Room,
            key: 'id'
          },
          defaultValue: 1,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: User,
            key: 'id'
          },
          defaultValue: 1,
          allowNull: false
        }
      },
    );

    Message.belongsTo(User, {
      foreignKey: { name: 'userId'}
    });
    Message.belongsTo(Room, {
      foreignKey: { name: 'roomId'}
    });

    if (drop) {
      db.drop();
    }
    db.sync({force: drop})
      .then(() => {
        if (drop) {
          User.create({ id: 1, username: 'Anonymous' });
          Room.create({ id: 1, roomname: 'Lobby' });
        }

      });
    //module.exports = db;
    return {
      User,
      Room,
      Message,
      dbName,
      sequelize: db
    };
  });

};
// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".


