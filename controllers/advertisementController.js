const fs = require('fs');
const multerConfig = require('../utils/MulterConfiguration'); // adjust the path as necessary
const imageResizer = require('../utils/ResizingMiddleware'); // adjust the path as necessary
const Advertisement = require('../models/advertisementsModel')
const { catchAsync } = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);

exports.uploadAdvPhoto = multerConfig.singleUpload('image');

exports.resizeAdvPhoto = imageResizer.resizePhoto('Advertisement', 'Advertisements');

exports.create = catchAsync(async (req, res, next) => {
    if (req.file) req.body.image = `public/img/Advertisements/${req.file.filename}`;
    const doc = await Advertisement.create(req.body);
    res.status(200).json({
        status: true,
        doc
    })
})

exports.get = catchAsync(async (req, res, next) => {
    const doc = await Advertisement.find();
    if (!doc) return next(new AppError(`not found`, 404))
    res.status(200).json({
        status: true,
        doc
    })
})
exports.update = catchAsync(async (req, res, next) => {
    if (req.file) req.body.image = `public/img/Advertisements/${req.file.filename}`;
    const doc = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return next(new AppError(`not found`, 404))
    res.status(200).json({
        status: true,
        message: "updated Successfully",
        doc
    })
})
exports.delete = catchAsync(async (req, res, next) => {
    const doc = await Advertisement.findById(req.params.id);
    if (!doc) return next(new AppError(`not found`, 404))
    fs.unlink(doc.image, (err) => {
        if (err) {
            console.log("delete image errrrrrrrrrrrrrr")
        }
    });

    await doc.remove();

    res.status(204).json({
        status: true,
        data: null

    })
})