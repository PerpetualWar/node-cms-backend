const mongoose = require('mongoose');
const validator = require('validator');

const ProfileSchema = new mongoose.Schema({
  
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = { Profile }