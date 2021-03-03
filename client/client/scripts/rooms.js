var Rooms = {
  names: {},
  populateRooms: function(data) {
    data.forEach((item) => {
      let roomname = MessageView.format(item).roomname ?? 'lobby';
      Rooms.names[roomname] = true;
    });
    RoomsView.populateSelectBox();
  },
  createRoom: function(roomname) {
    let room = MessageView.format({'roomname': roomname}).roomname;
    Rooms.names[room] = true;
    RoomsView.populateSelectBox();
  },
  currentRoom: {},

};