var Friends = {

  list: JSON.parse(localStorage.getItem('FriendsList')) ?? {},

  toggleStatus: function(username) {
    Friends.list[username] = !Friends.list[username];
    localStorage.setItem('FriendsList', JSON.stringify(Friends.list));

  }

};