var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "shhh..";

module.exports = function (user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(10, 'days').unix()
  };

  var token = jwt.encode(payload, secret);

  res.send({
    user: user.toJSON(),
    token: token
  });
};