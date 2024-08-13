const Favourite = require('../models/favouriteModel');
const { catchAsync } = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);

//protect
exports.addFavs = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;
    const doc = await Favourite.create(req.body);
    res.status(201).json({
        status: true,
        message: 'Product added to your Favourites',
        doc
    })
})

exports.getFavs = catchAsync(async (req, res, next) => {
    const data = await Favourite.find({ user: req.user.id });
    if (!data || data.length === 0) return next(new AppError(`not found`, 404));
    res.status(200).json({
        status: true,
        data
    })
})
exports.deleteFav = catchAsync(async (req, res, next) => {
    const doc = await Favourite.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!doc) return next(new AppError(`not found`, 404));
    res.status(204).json({
        status: true,
        data: null
    })
})