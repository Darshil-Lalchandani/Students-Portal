const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.connect(
  "mongodb+srv://darshil:darshilsaf1234@node-rest-api.gboau.mongodb.net/studentsPortal?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;

//User schema
const UserSchema = new mongoose.Schema({
  rollno: {
    type: String,
    index: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  profileimage: {
    type: String,
  },
});

var User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function (rollno, callback) {
  var query = { rollno: rollno };
  User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    callback(null, isMatch);
  });
};

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};
