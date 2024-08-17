const mongoose = require('mongoose')
const favouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
})

favouriteSchema.index({ product: 1, user: 1 }, { unique: true });


favouriteSchema.pre(/^find/, function (next) {
    this.select('-user -__v').populate({
        path: 'product',
        select: '-reviews'
    })//.populate({path:'user'})
    next();
})
const Favourite = mongoose.model('Favourite', favouriteSchema)

module.exports = Favourite;