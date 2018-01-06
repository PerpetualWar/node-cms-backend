const mongoose = require('mongoose');
const validator = require('validator');

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  author: { type: ObjectId },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment }