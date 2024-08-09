const multer = require('multer');
const AppError = require('./appError'); // adjust the path as necessary

class MulterConfig {
  constructor() {
    this.multerStorage = multer.memoryStorage();
  }

  multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  }

  singleUpload(fieldName) {
    return multer({
      storage: this.multerStorage,
      limits: { fileSize: 2000000 },
      fileFilter: this.multerFilter
    }).single(fieldName);
  }

  multipleUpload(fields) {
    return multer({
      storage: this.multerStorage,
      fileFilter: this.multerFilter
    }).fields(fields);
  }
}

module.exports = new MulterConfig();
