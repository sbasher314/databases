let db;
require('../db')().then(result => db = result);

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
      return db.Message.findAll({
        raw: true,
        attributes: ['text', 'userId', 'roomId', 'user.username', 'room.roomname'],
        include: [{
          model: db.User,
          required: true
        }, {
          model: db.Room,
          required: true
        }]
      })
        .then(messages => JSON.stringify(messages, null, 2))
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
          return JSON.stringify(result.dataValues, null, 2);
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
  }
};

