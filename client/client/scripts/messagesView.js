var MessagesView = {

  $chats: $('#chats'),

  initialize: function() {

  },

  render: function(messages) {
    MessagesView.$chats[0].innerHTML = '';
    messages.forEach(message => MessagesView.renderMessage(message));
  },

  renderMessage: function(message) {
    message = MessageView.format(message);
    let $message = $(MessageView.render(message));
    if (Friends.list[message.username]) {
      $message.find('div.username a').addClass('friend');
    }
    $message.appendTo(this.$chats);
    $message.find('div.username a').on('click', function() {
      let username = $(this).parent().attr('username');
      Friends.toggleStatus(username);
      MessagesView.displayFriends();
    });
  },

  displayFriends: function() {
    $.each(MessagesView.$chats.find('div .username'), (i, item) => {
      let username = item.getAttribute('username');
      if (Friends.list[username]) {
        $(item).find('a').addClass('friend');
      } else {
        $(item).find('a').removeClass('friend');
      }
    });
  }

};