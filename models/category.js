const mongoose = require('mongoose');
const validator = require('validator');

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true, default: 'post' }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category, CategorySchema }