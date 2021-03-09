var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(res)
        .then(result => {
          res.end(result);
        })
        .catch(err => {
          res.statusCode = '404';
          res.write(err);
          res.end();
        });
    },
    post: function (req, res) {
      let message = {
        text: req.body.text,
        username: req.body.username,
        roomname: req.body.roomname
      };
      models.messages.post(message)
        .then(result => {
          res.statusCode = 200;
          res.write(result);
          res.end();
        })
        .catch(err => {
          res.statusCode = 500;
          res.write('Error: ' + err);
          res.end();
        });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      let params = new URLSearchParams(req.originalUrl.split('?')[1]);
      let username = req.body.username || params.get('username');
      models.users.get(req.body.username)
        .then(res.end)
        .catch( err => {
          res.statusCode = '404';
          res.write(err);
          res.end();
        });
    },
    post: function (req, res) {
      models.users.post(req.body.username)
        .then(() => res.end(), err => {
          res.statusCode = 409; //username conflicts with db
          res.write('Error: ' + err);
          res.end();
        });
    }
  },

  rooms: {
    get: function(req, res) {
      let params = new URLSearchParams(req.originalUrl.split('?')[1]);
      let roomname = req.body.roomname || params.get('roomname');
      models.rooms.get(roomname)
        .then(result => {
          console.log(result);
          res.write(result);
          res.end();
        })
        .catch(err => {
          res.statusCode = 404;
          res.end(err);
        });
    },
    post: function(req, res) {
      models.rooms.post(req.body.roomname)
        .then(res.end);
    }
  }
};