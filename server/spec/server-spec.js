/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;
var { testing, dbName } = require('../config.js');
describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: dbName
    });
    dbConnection.connect();

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    if (testing) {
      dbConnection.query('truncate ' + 'messages', done);
    } else {
      done();
    }

  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    request({
      method: 'POST',
      uri: 'http://localhost:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      request({
        method: 'POST',
        uri: 'http://localhost:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        var queryString = `select text, users.username, rooms.roomname from messages
        inner join users on messages.userId = users.id
        inner join rooms on messages.roomId = rooms.id`;
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          expect(results.length).to.equal(1);
          expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');
          expect(results[0].username).to.equal('Valjean');
          expect(results[0].roomname).to.equal('Hello');
          done();
        });
      });
    });

  });

  it('Should insert incomplete formatted messages to DB with default values', function(done) {
    request({
      method: 'POST',
      uri: 'http://localhost:3000/classes/messages',
      json: {
        text: 'In mercy\'s name, three days is all I need.',
      }
    }, function () {
      var queryString = `select text, users.username, rooms.roomname from messages
        inner join users on messages.userId = users.id
        inner join rooms on messages.roomId = rooms.id`;
      var queryArgs = [];

      dbConnection.query(queryString, queryArgs, function(err, results) {
        expect(results.length).to.equal(1);
        expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');
        expect(results[0].username).to.equal('Anonymous');
        expect(results[0].roomname).to.equal('Lobby');
        done();
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    var queryString = 'insert into messages (text, userId, roomId) values ("Men like you can never change!", (select id from users where username = "Anonymous"), (select id from rooms where roomname = "Lobby"))';
    var queryArgs = [];
    dbConnection.query(queryString, queryArgs, function(err, results) {
      if (err) { throw err; }
      request('http://localhost:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].text).to.equal('Men like you can never change!');
        expect(messageLog[0].username).to.equal('Anonymous');
        expect(messageLog[0].roomname).to.equal('Lobby');
        done();
      });
    });
  });
});
