const multer = require('multer');
const AppError = require('./appError'); // adjust the path as necessary

class MulterConfig {
  constructor() {
    this.multerStorage = multer.memoryStorage();
  }

  multerFilter(req, file, cb) {
    // Define allowed MIME types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type! Please upload a JPEG, PNG, or JPG image.', 400), false);
    }
  }

  singleUpload(fieldName) {
    return multer({
      storage: this.multerStorage,
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
