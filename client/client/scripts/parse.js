var Parse = {

  server: `http://parse.${window.CAMPUS}.hackreactor.com/chatterbox/classes/messages`,

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
      url: Parse.server,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: successCB,
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  readRoom: function(roomname, successCB = () => {}, messages) {
    if (messages === undefined) {
      Parse.readAll((data) => {
        Messages = data;
        successCB(Parse.readRoom(roomname, () => {}, data));
      });
    } else {
      let roomMessages = [];
      messages.results.forEach((message) => {
        message = MessageView.format(message);
        if (MessageView.format(message).roomname === roomname) {
          roomMessages.push(message);
        }
      });
      successCB(roomMessages);
      return roomMessages;
    }
  }
};