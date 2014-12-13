var mongoose = require('mongoose');

module.exports = mongoose('User',
  {
    username: String,
    password: String,
    email: String,
});
