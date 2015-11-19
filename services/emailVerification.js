/**
 * Created by sdonose on 11/17/2015.
 */
var _ = require('underscore');
var fs = require('fs');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('./config.js');
var User = require('../models/User.js');


var model = {
  verifyUrl: 'http://localhost:3000/verifyEmail?token=',
  title: 'Socket Chat',
  subTitle: 'Thanks for signing up!',
  body: 'Please verify your email address by clicking the button below'
}

exports.send = function (email) {
  var payload = {
    sub: email
  }

  var token = jwt.encode(payload, config.SECRET);
  console.log('user',token)

  var transporter = nodemailer.createTransport(smtpTransport({
    service: "yahoo",
    secure: true,
    auth: {
      user: 'sidona_g@yahoo.com',
      pass: config.SMTP_PASS
    }
  }));

  var mailOptions = {
    from: '<sidona_g@yahoo.com>',
    to: email,
    subject: ' Account Verification',
    html: getHtml(token)
  };

  transporter.sendMail(mailOptions, function (req,res,err) {
    if (err) return res.status(500, err);

    console.log('email sent ');
  })
}

exports.handler = function (req, res) {
  var token = req.query.token;

  console.log(token)
  var payload = jwt.decode(token, config.SECRET);
  console.log(payload)
  var email = payload.sub;

  if (!email) return handleError(res);

  User.findOne({
    email: email
  }, function (err, foundUser) {
    if (err) return res.status(500);

    if (!foundUser) return handleError(res);

    if (!foundUser.active)
      foundUser.active = true;

    foundUser.save(function (err) {
      if (err) return res.status(500);

      return res.redirect(config.APP_URL);
    })
  })
}


function getHtml(token) {
  var path = './views/emailVerification.html';
  var html = fs.readFileSync(path, encoding = 'utf8');

  var template = _.template(html);

  model.verifyUrl += token;

  return template(model);
}

function handleError(res) {
  return res.status(401).send({
    message: 'Authentication failed, unable to verify email'
  });
}


_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};