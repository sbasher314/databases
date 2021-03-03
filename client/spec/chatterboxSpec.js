describe('chatterbox', function() {

  describe('ajax behavior', function() {
    var ajaxSpy;

    before(function() {
      ajaxSpy = sinon.stub($, 'ajax');
      App.initialize();
    });

    beforeEach(function() {
      ajaxSpy.reset();
    });

    describe('creating', function() {
      it('should submit a POST request via $.ajax', function(done) {
        Parse.create({});
        expect($.ajax.calledOnce).to.be.true;
        // sinon.spy method `args` comes in the form [function calls][arguments from that call]
        ajaxOptions = typeof $.ajax.args[0][0] === 'object' ? $.ajax.args[0][0] : $.ajax.args[0][1];
        expect(ajaxOptions.type).to.equal('POST');
        done();
      });

      it('should send the message along with the request as a stringified object', function(done) {
        var message = {
          username: 'Mel Brooks',
          text: 'It\'s good to be the king',
          roomname: 'lobby'
        };

        Parse.create(message);
        ajaxOptions = typeof $.ajax.args[0][0] === 'object' ? $.ajax.args[0][0] : $.ajax.args[0][1];
        expect(ajaxOptions.data).to.be.a('string');
        expect(ajaxOptions.contentType).to.equal('application/json');
        done();
      });

      it('should send the correct message along with the request', function(done) {
        var message = {
          username: 'Mel Brooks',
          text: 'It\'s good to be the king',
          roomname: 'lobby'
        };

        Parse.create(message);
        ajaxOptions = typeof $.ajax.args[0][0] === 'object' ? $.ajax.args[0][0] : $.ajax.args[0][1];
        var sentMessage = JSON.parse(ajaxOptions.data);
        expect(sentMessage).to.deep.equal(message);
        done();
      });

    });

    describe('fetching', function() {
      it('should submit a GET request via $.ajax', function(done) {
        Parse.readAll();
        expect($.ajax.calledOnce).to.be.true;
        ajaxUrl = typeof $.ajax.args[0][0] === 'string' ? $.ajax.args[0][0] : $.ajax.args[0][0].url;
        expect(ajaxUrl).to.equal(Parse.server);
        done();
      });

    });
  });

  describe('chatroom behavior', function() {
    it('should be able to add messages to the DOM', function() {
      var message = {
        username: 'Mel Brooks',
        text: 'Never underestimate the power of the Schwartz!',
        roomname: 'lobby'
      };
      MessagesView.renderMessage(message);
      expect($('#chats').children().length).to.equal(1);
    });

    it('should be able to add rooms to the available selections', function() {
      Rooms.createRoom('superLobby');
      expect($('#roomsList').children().length).to.equal(1);
    });

    it('should be able to show rooms and their respective messages to the DOM', function() {
      // !! ToDo -- create a few dummy messages, test if they can be filtered and added to chats properly
      let messages = [
        {'username': 'bob', 'text': 'blah', 'roomname': 'the room'},
        {'username': 'bob', 'text': 'blee', 'roomname': 'not the room'},
        {'username': 'bob', 'text': 'bloo', 'roomname': 'another room'},
        {'username': 'bob', 'text': 'blay', 'roomname': 'the room'},
      ];
      RoomsView.renderRoom('the room', {'results': messages});
      expect($('#chats').children().length).to.equal(2);
      RoomsView.renderRoom('not the room', {'results': messages});
      expect($('#chats').children().length).to.equal(1);
      RoomsView.renderRoom('A nonexistent room!', {'results': messages});
      expect($('#chats').children().length).to.equal(0);
    });

  });

  describe('events', function() {
    it('should add a friend upon clicking their username', function() {
      sinon.spy(Friends, 'toggleStatus');

      App.initialize();
      MessagesView.renderMessage({
        username: 'Mel Brooks',
        text: 'I didn\'t get a harumph outa that guy.!',
        roomname: 'lobby'
      });
      $('#chats').find('.username a').trigger('click');
      expect(Friends.toggleStatus.called).to.be.true;

      Friends.toggleStatus.restore();
    });

    it('should add a room when clicking add', function() {
      sinon.spy(Rooms, 'createRoom');
      var prompt = window.prompt;
      window.prompt = sinon.stub().returns('testroom');

      App.initialize();
      $('#rooms').find('button').trigger('click');
      expect(Rooms.createRoom.called).to.be.true;

      window.prompt = prompt;
      Rooms.createRoom.restore();
    });

    it('should try to send a message upon clicking submit', function() {
      sinon.spy(Parse, 'create');

      App.initialize();
      $('#message').val('Why so many Mel Brooks quotes?');
      $('form .submit').trigger('submit');
      expect(Parse.create.called).to.be.true;

      Parse.create.restore();
    });
  });

  describe('Advanced Content', function() {

    it('should have a Parse query that returns only messages from a certain room', function(done) {
      App.initialize();
      let messages = [
        {'username': 'bob', 'text': 'blah', 'roomname': 'the room'},
        {'username': 'bob', 'text': 'blee', 'roomname': 'not the room'},
        {'username': 'bob', 'text': 'bloo', 'roomname': 'another room'},
        {'username': 'bob', 'text': 'blay', 'roomname': 'the room'},
      ];
      let responseRoom = Parse.readRoom('the room', () => {}, {'results': messages});
      expect(responseRoom.length).to.equal(2);
      done();
    });

  });
});
