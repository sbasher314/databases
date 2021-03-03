var MessageView = {

  render: _.template(`
      <div class="chat">
        <div class="username" username="<%- username %>"><a><%- username %></a></div>
        <div><%- text %></div>
      </div>
    `),

  format: function({text = '', username = 'anonymous', roomname = 'lobby'} = {}) {
    username = username.trim() === '' ? 'anonymous' : username;
    return {'text': text.trim(), 'username': username, 'roomname': roomname};
  }
};