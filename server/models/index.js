let db;
require('../db')().then(result => db = result);

var stringify = obj => JSON.stringify(obj, null, 2);
var getId = (name, type, propName, insert = true) => {
  return db[type].findAll({
    attributes: ['id'],
    where: {
      [propName]: name
    }
  })
    .then(id => {
      if (id.length === 0) {
        if (!insert) {
          return Promise.reject('Username not found');
        }
        return db[type].create({[propName]: name})
          .then(id => {
            return id;
          });

      } else {
        return id[0];
      }
    })
    .then(id => {
      return Promise.resolve(id.dataValues.id);
    })
    .catch(err => console.log(err));

};

module.exports = {
  messages: {
    get: function () {
      return db.sequelize.query(
        `Select messages.*, users.username, rooms.roomname
        From messages
        inner join users
        on messages.userId = users.id
        inner join rooms
        on messages.roomId = rooms.id
        order by messages.updatedAt desc`)
        .then(messages => stringify(messages[0]))
        .catch(err => console.log(err));
    }, // a function which produces all the messages
    post: async function (req) {
      let message = {text: req.text};
      message.userId = await getId(req.username, 'User', 'username');
      message.roomId = await getId(req.roomname, 'Room', 'roomname');
      return db.Message.create(message)
        .then(result => {
          result.dataValues.username = req.username;
          result.dataValues.roomname = req.roomname;
          return stringify(result.dataValues);
        });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (username) {
      return getId(username, 'User', 'username', false);
    },
    post: function (username) {
      return getId(username, 'User', 'username');
    }
  },

  rooms: {
    get: async function(roomname) {
      let queryObject = {roomname, raw: true, order: [['updatedAt', 'DESC']]};
      if (roomname !== undefined) {
        let roomId = await getId(roomname, 'Room', 'roomname');
        queryObject.where = { roomId };
      }
      if (roomname === undefined) {
        return db.Room.findAll(queryObject)
          .then(stringify);
      }
      return db.Message.findAll(queryObject)
        .then(result => {
          if (result.length === 0) {
            return Promise.reject('Room not found');
          }
          return stringify(result);
        });
    },
    post: function(roomname) {
      return db.room.create({roomname})
        .then(stringify);
    }
  }
};

