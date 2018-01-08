const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  gallery: [{
    image: {
      type: String
    },
    name: {
      type: String
    },
    contentType: {
      type: String
    },
    galleryName: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Gallery = mongoose.model('Gallery', GallerySchema);

module.exports = { Gallery }