var testing = true;
var dbName = testing ? 'chat_test' : 'chat';
var drop = false;
module.exports = {
  testing,
  dbName,
  drop: drop ?? testing
};