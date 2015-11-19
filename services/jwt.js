var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config.js');

module.exports = function (user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(1, 'days').unix()
  };

  var token = jwt.encode(payload, config.SECRET);
  console.log(token)
  var decode=jwt.decode(token,config.SECRET);
  console.log(decode);

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });

};