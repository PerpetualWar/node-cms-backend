const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, 
  // { useMongoClient: true } //deprecated in mongoose 5.0.0., already using mongoclient
);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connection open')

module.exports = { mongoose };