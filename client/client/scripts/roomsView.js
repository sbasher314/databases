var RoomsView = {

  $button: $('#rooms button'),
  $dropdown: $('#rooms .dropdown'),
  $roomsList: $('#roomsList'),
  $select: $('#roomSelect'),
  dropdownVisible: false,

  initialize: function() {
    RoomsView.$select.on('focus', (e) => RoomsView.roomSelectHandler(e));
    RoomsView.$select.on('keyup paste', (e) => RoomsView.roomSelectHandler(e, 'hide'));
    RoomsView.$dropdown.on('focus mouseup click', (e) => RoomsView.roomSelectHandler(e, 'show'));
    RoomsView.$dropdown.on('blur', (e) => RoomsView.roomSelectHandler(e, 'hide'));

  },

  render: function() {
  },

  renderRoom: function(roomname, messages, callback = () => {}) {
    Parse.readRoom(roomname, (response) => { callback(); MessagesView.render(response); }, messages);
  },

  roomSelectHandler: function(e = {'which': 0, 'type': 'none'}, visibility) {
    if (e.type === 'keyup' && (e.which === 13 || e.which === undefined)) {
      //exits textbox if you press enter, also hacky workaround for chrome datalist flickering
      visibility = 'hide';
      RoomsView.$select.blur();
    }
    if (visibility === 'hide') {
      RoomsView.dropdownVisible = false;
      RoomsView.$dropdown.removeClass('dropdownVisible');
      RoomsView.$roomsList.fadeOut(50);
      RoomsView.$select.attr('list', 'roomsList');
    }
    if (visibility === 'show') {
      RoomsView.dropdownVisible = true;
      RoomsView.$dropdown.addClass('dropdownVisible');
      RoomsView.$roomsList.fadeIn(50);
      RoomsView.$select.attr('list', '');
    }
    setTimeout(() => {
      let roomname = RoomsView.$select.val();
      RoomsView.renderRoom(roomname);
      RoomsView.roomsListPosition();
    }, 10);

  },

  populateSelectBox: function() {
    RoomsView.$roomsList.html('');
    for (roomname in Rooms.names) {
      let option = $(`<option value="${roomname}">${roomname}</option>`);
      option.appendTo(RoomsView.$roomsList);
      option.on('click mousedown mouseup', (e) => {
        RoomsView.$select.val(e.target.value);
        RoomsView.roomSelectHandler();
        RoomsView.$roomsList.hide();
      });
    }
    RoomsView.roomsListPosition();
  },

  roomsListPosition: function() {
    RoomsView.$roomsList.css({
      'min-width': RoomsView.$select[0].offsetWidth + 'px',
      'left': RoomsView.$select[0].offsetLeft + 'px',
      'top': RoomsView.$select[0].offsetTop + RoomsView.$select[0].offsetHeight + 'px',
    });
  }

};


