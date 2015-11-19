
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var ProfileSchema=new mongoose.Schema({

    name:String,
    gender:  String,
    location: String ,
    website:  String ,
    picture:  String

});



var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  displayName:String,
  active:Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profile:{
    name:String,
    gender:  String,
    location: String ,
    website:  String ,
    picture:  String
  },

  posts : [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

UserSchema.methods.toJSON = function () {
  var user = this.toObject();
  delete user.password;
  return user;
};

UserSchema.methods.comparePasswords = function (password, callback) {
  bcrypt.compare(password, this.password, function(err,isMatch){
    if(err) return callback(err);
    callback(null,isMatch)
  })
};




UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password'))
    return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    })
  })

});

module.exports = mongoose.model('User', UserSchema);

