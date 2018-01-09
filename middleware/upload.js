const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, callback) => {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')
      return callback(new Error('only images are allowed'), false)
    callback(null, true)
  }
});

module.exports = { upload };