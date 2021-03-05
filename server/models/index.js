var db = require('../db');
var util = require('util');
var queryPromise = util.promisify(db.query).bind(db);

getId = (name, type, cb) => {
  db.query(`Select id from ${type}s where ${type}name = "${name}"`, (err, results) => {
    if (err) {
      throw err;
    }
    cb(results[0]?.id);
  });
};

module.exports = {
  messages: {
    get: function (res) {
      queryPromise('select text, username, roomname from messages')
        .then(results => {
          res.end(JSON.stringify(results));
        })
        .catch(err => { throw err; });
    }, // a function which produces all the messages
    post: function (message, res) {
      getId(message.username, 'user', (id) => {
        message.username = id;
        getId(message.roomname, 'room', (id) => {
          message.roomname = id;
          queryPromise('insert into messages set ?', message)
            .then(results => { res.end(); })
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
    post: function (username) {
      return module.exports.users.get(username)
        .then(results => JSON.parse(results))
        .then(results => {
          if (results.length === 0) {
            return queryPromise('insert into users set ?', {username});
          }
        })
        .catch(err => { throw err; });
    }
  }
};

