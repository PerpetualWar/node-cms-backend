const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  userObject.id = userObject._id;
  return _.pick(userObject, ['id', 'email']);
};

UserSchema.methods.generateAuthToken = async function () { //adding custom method to instances of models
  const access = 'auth';
  const token = jwt.sign({ _id: this._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  this.tokens.push({ access, token });

  await this.save();
  return token;
};

UserSchema.methods.removeToken = async function (token) {
  try {
    return await this.update({
      $pull: {
        tokens: { token }
      }
    });
  } catch (e) {
    return Promise.reject();
  }
  // return this.update({
  //   $pull: {
  //     tokens: { token }
  //   }
  // })
};

UserSchema.statics.findByToken = async function (token) { // adding custom model method by statics
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await this.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  } catch (e) {
    return Promise.reject();
  }
};
UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    // console.log(this)
    if (!user)
      return Promise.reject();
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        // console.log(res)
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      })
    });
  } catch (e) {
    return Promise.reject();
  }
};

UserSchema.pre('save', function (next) {  //hashing the password in mongoose middleware before saving to the db
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User }