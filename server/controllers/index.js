var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(res);
    },
    post: function (req, res) {
      let message = {
        text: req.body.text,
        username: req.body.username,
        roomname: req.body.roomname
      };
      models.messages.post(message, res);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(req.body.username)
        .then(result => res.end(result))
        .catch(err => {
          res.statusCode = '404';
          res.write(JSON.stringify(err));
          res.end();
        });
    },
    post: function (req, res) {
      models.users.post(req.body.username)
        .then(() => res.end());
    }
  }
};