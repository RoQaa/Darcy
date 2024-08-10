const sharp = require('sharp');
const { catchAsync } = require('./catchAsync'); // Adjust the path as necessary

class ImageResizer {
  constructor() {}

  resizePhoto(name,fileName) {
    return catchAsync(async (req, res, next) => {
      if (!req.file) return next();

      req.file.filename = `${name}-${req.user.id}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/${fileName}/${req.file.filename}`);

      next();
    });
  }

  resizeProductImages() {
    return catchAsync(async (req, res, next) => {
      if (!req.files.images) return next();

     
      // 2) Resize Images with Color Names
      req.body.images = [];

      await Promise.all(
        req.files.images.map(async (file, i) => {
          const colorName = req.body.colors[i].name; // Assuming color names are sent in req.body.colors
          const filename = `product-${req.user.id}-${Date.now()}-${colorName}.jpeg`;

          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/products/${filename}`);

          req.body.colors[i].image=`public/img/products/${filename}`
        })
      );
      next();
    });
  }
}

module.exports = new ImageResizer();
