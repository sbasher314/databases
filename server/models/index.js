const db = require('../db');
var util = require('util');
//var queryPromise = util.promisify(db.query).bind(db);

getId = (name, type, cb) => {
  db.query(`Select id from ${type}s where ${type}name = "${name}"`, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (name === undefined || name === 'undefined') {
      cb(1);
    } else if (results[0]?.id === undefined) {
      queryPromise(`insert into ${type}s (${type}name) values("${name}")`)
        .then(results => cb(results.insertId))
        .catch(err => { console.log(err); });
    } else {
      cb(results[0]?.id);
    }

  });
};

module.exports = {
  messages: {
    get: function (res) {
      queryPromise(
        `select text, users.username, rooms.roomname from messages
        inner join users on messages.username = users.id
        inner join rooms on messages.roomname = rooms.id`) // should make this an inner join to return roomname and usernames rather than IDs
        .then(results => {
          res.end(JSON.stringify(results));
        })
        .catch(err => console.log(err));
    }, // a function which produces all the messages
    post: function (message, res) {
      getId(message.username, 'user', (id) => {
        message.username = id || 1;
        getId(message.roomname, 'room', (id) => {
          message.roomname = id || 1;
          queryPromise('insert into messages set ?', message)
            .then(results => {
              res.end();
            })
            .catch(err => { throw err; });
        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (username) {
      var queryString = 'select * from users';
      if (username !== undefined) {
        queryString = `select * from users where username = "${username}"`;
      }
      return queryPromise(queryString)
        .then(results => JSON.stringify(results));
    },
    post: async function (username) {
      console.log(db);
      await db.User.create({username}, {fields: username});
      /*return module.exports.users.get(username)
        .then(results => JSON.parse(results))
        .then(results => {
          if (results.length === 0) {
            return queryPromise('insert into users set ?', {username});
          }
        })
        .catch(err => { throw err; });*/
    }
  }
};

