var Parse = {

  server: 'http://localhost:3000/classes/',

  create: function(message, successCB = null, errorCB = null) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: Parse.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: successCB || function (data) {
        console.log('chatterbox: Message sent');
      },
      error: errorCB || function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  readAll: function(successCB, errorCB = null) {
    $.ajax({
      url: Parse.server + 'messages',
      type: 'GET',
      contentType: 'application/json',
      success: successCB,
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  readRoom: function(roomname, successCB = () => {}, errorCB = null) {
    let roomMessages = [];
    console.log(roomname);
    $.ajax({
      url: Parse.server + 'rooms',
      data: { roomname },
      type: 'GET',
      contentType: 'application/json',
      success: data => {
        console.log(data);
        successCB(data);
        return data;
      },
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  }
};