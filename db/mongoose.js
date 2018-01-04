const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, 
  // { useMongoClient: true } //deprecated in mongoose 5.0.0., already using mongoclient
);

module.exports = { mongoose };