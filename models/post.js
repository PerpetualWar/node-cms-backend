const mongoose = require('mongoose');
const validator = require('validator');

const PostSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId
  },
  category: {
    type: String,
    enum: ['news', 'articles', 'columns', 'comments'],
    required: true,
  },
  tags: [{
    type: String
  }]
});

const Post = mongoose.model('Post', PostSchema);

module.exports = { Post }