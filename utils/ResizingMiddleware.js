const sharp = require('sharp');
const { catchAsync } = require('./catchAsync'); // Adjust the path as necessary

class ImageResizer {
  constructor() {}

  resizeUserPhoto() {
    return catchAsync(async (req, res, next) => {
      if (!req.file) return next();

      req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

      next();
    });
  }

  resizeProductImages(productId) {
    return catchAsync(async (req, res, next) => {
      if (!req.files.backGroundImage || !req.files.images) return next();

      const backGroundPath = `product-${productId}-${Date.now()}-cover.jpeg`;
      req.body.backGroundImage = `public/img/products/${backGroundPath}`;

      // 1) Resize Background Image
      await sharp(req.files.backGroundImage[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${backGroundPath}`);

      // 2) Resize Images with Color Names
      req.body.images = [];

      await Promise.all(
        req.files.images.map(async (file, i) => {
          const colorName = req.body.colors[i].name; // Assuming color names are sent in req.body.colors
          const filename = `product-${productId}-${Date.now()}-${colorName}.jpeg`;

          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/products/${filename}`);

          req.body.images.push(`public/img/products/${filename}`);
        })
      );
      next();
    });
  }
}

module.exports = new ImageResizer();
