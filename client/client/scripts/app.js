var App = {

  $spinner: $('.spinner img'),

  username: 'anonymous',

  initialize: function() {
    App.username = window.location.search.substr(10);
    FormView.initialize();
    RoomsView.initialize();
    MessagesView.initialize();

    // Fetch initial batch of messages
    App.update();
  },

  fetch: function(callback = ()=>{}) {
    Parse.readAll((data) => {
      console.log(data);
      // examine the response from the server request:
      RoomsView.renderRoom('Lobby');
      Rooms.populateRooms(data);
      Messages = data;
      callback();
    });
  },

  update: function(state, roomname) {
    App.startSpinner();
    if (state === 'submit') {
      RoomsView.renderRoom(roomname, undefined, App.stopSpinner);
    } else {
      App.fetch(App.stopSpinner);
    }
  },

  startSpinner: function() {
    App.$spinner.show();
    FormView.setStatus(true);
  },

  stopSpinner: function() {
    App.$spinner.fadeOut('fast');
    //We don't want the user to be able to post empty messages
    //FormView.setStatus(false);
  }
};
