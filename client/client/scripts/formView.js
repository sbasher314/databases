var FormView = {

  $form: $('form'),

  initialize: function() {
    FormView.$form.on('submit', FormView.handleSubmit);
    FormView.$form.find('#message').on('change keyup cut paste mouseup',
      (e) => setTimeout(() => FormView.handleTextUpdate(e), 10));
    $('#rooms').find('button').on('click mousedown mouseup', FormView.handleAddRoom);
  },


  handleSubmit: function(event) {
    // Stop the browser from submitting the form
    event.preventDefault();
    let messageBox = FormView.$form.find('#message');
    let selectedRoom = $('#roomSelect').val();
    let message = {'text': messageBox.val(), 'username': App.username, 'roomname': selectedRoom};
    //send message to server ---
    if (message.text !== '') {
      FormView.setStatus(true);
      setTimeout(() => FormView.setStatus(false), 1000);
      Parse.create(MessageView.format(message), () => {
        App.update('submit', selectedRoom);
        messageBox.val('');
      });
    }

  },

  handleTextUpdate: function(event) {
    var text = FormView.$form.find('#message').val();
    FormView.setStatus(text.trim() === '');
  },

  handleAddRoom: function(event) {
    Rooms.createRoom(RoomsView.$select.val());
  },

  setStatus: function(active) {
    var status = active ? 'true' : null;
    FormView.$form.find('input[type=submit]').attr('disabled', status);
  }

};